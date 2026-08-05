using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using RestaurantManagementSystem.Data;
using RestaurantManagementSystem.DTOs;
using RestaurantManagementSystem.Models;
using System.Security.Claims;

namespace RestaurantManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ReservationsController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateReservation(CreateReservationRequest request)
        {
            var table = await _context.RestaurantTables.FindAsync(request.TableId);
            if (table == null)
            {
                return NotFound("Table not found.");
            }
            
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            if(request.ReservationTime <= DateTime.Now)
            {
                return BadRequest("Reservation time cannot be in the past.");
            }

            var alreadyReserved = await _context.Reservations
                .AnyAsync(r => r.TableId == request.TableId && r.ReservationTime == request.ReservationTime);

            if (alreadyReserved)
            {
                return BadRequest("Table is already reserved for the selected time.");
            }

            var reservation = new Reservation
            {
                UserId = userId,
                TableId = request.TableId,
                ReservationTime = request.ReservationTime,
                Status = "Pending"
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return Ok(new ReservationResponse
            {
                Id = reservation.Id,
                UserName = User.Identity!.Name!,
                TableId = reservation.TableId,
                TableNumber = table.TableNumber,
                ReservationTime = reservation.ReservationTime,
                Status = reservation.Status
            });

        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUserReservations()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var reservations = await _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Table)
            .Where(r => r.UserId == userId)
            .Select(r => new ReservationResponse
        {
            Id = r.Id,
            UserName = r.User.Name,
            TableId = r.TableId,
            TableNumber = r.Table.TableNumber,
            Status = r.Status,
            ReservationTime = r.ReservationTime,
        })
            .ToListAsync();
            return Ok(reservations);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllReservations()
        {
            var reservations = await _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Table)
                .OrderByDescending(r => r.ReservationTime)
                .Select(r => new ReservationResponse
                {
                    Id = r.Id,
                    UserName = r.User.Name,
                    TableId = r.TableId,
                    TableNumber = r.Table.TableNumber,
                    ReservationTime = r.ReservationTime,
                    Status = r.Status
                })
                .ToListAsync();

            return Ok(reservations);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateReservationStatus(
        int id,
        UpdateReservationStatusRequest request)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation == null)
                return NotFound("Reservation not found.");

            var validStatuses = new[]
            {
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled"
    };

            if (!validStatuses.Contains(request.Status))
                return BadRequest("Invalid status.");

            reservation.Status = request.Status;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Reservation updated successfully."
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{reservationId}")]
        public async Task<IActionResult> CancelReservation(int reservationId)
        {
            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(r => r.Id == reservationId);
            if (reservation == null)
            {
                return NotFound("Reservation not found.");
            }
            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return Ok("Reservation cancelled successfully.");
        }


        [Authorize]
        [HttpGet("my-reservations")]
        public async Task<IActionResult> GetMyReservations()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var reservations = await _context.Reservations
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.ReservationTime)
                .Select(r => new ReservationResponse
                {
                    Id = r.Id,
                    UserName = r.User.Name,
                    TableId = r.TableId,
                    TableNumber = r.Table.TableNumber,
                    Status = r.Status,
                    ReservationTime = r.ReservationTime,
                })
                .ToListAsync();

            return Ok(reservations);
        }

        [Authorize]
        [HttpGet("my-reservations/{id}")]
        public async Task<IActionResult> GetMyReservationsById(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var reservation = await _context.Reservations
            .Include(r => r.User)
            .Include(r => r.Table)
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
            if (reservation == null)
            {
                return NotFound($"Reservation with id {id} not found");
            }
            return Ok(new ReservationResponse
            {
                Id = reservation.Id,
                UserName = reservation.User.Name,
                TableId = reservation.TableId,
                TableNumber = reservation.Table.TableNumber,
                ReservationTime = reservation.ReservationTime,
                Status = reservation.Status
            });
        }

        [Authorize]
        [HttpDelete("my-reservations/{id}")]
        public async Task<IActionResult> CancelMyReservation(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(r =>
                    r.Id == id &&
                    r.UserId == userId);

            if (reservation == null)
            {
                return NotFound("Reservation not found.");
            }

            if (reservation.Status != "Pending")
            {
                return BadRequest("Only pending reservations can be cancelled.");
            }

            reservation.Status = "Cancelled";

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Reservation cancelled successfully."
            });
        }
    }
}
