using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantManagementSystem.Data;
using RestaurantManagementSystem.Models;
using RestaurantManagementSystem.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace RestaurantManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TablesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TablesController(AppDbContext context)
        {
            _context = context;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateTable(CreateTableRequest request)
        {
            var exists = await _context.RestaurantTables
             .AnyAsync(t => t.TableNumber == request.TableNumber);

            if (exists)
            {
                return BadRequest("Table number already exists.");
            }

            if (request.Capacity <= 0 || request.Capacity > 20)
            {
                return BadRequest("Capacity must be between 1 and 20.");
            }

            if (request.TableNumber <= 0)
            {
                return BadRequest("Table number must be greater than zero.");
            }

            var table = new RestaurantTable
            {
                TableNumber = request.TableNumber,
                Capacity = request.Capacity,
                IsOccupied = false
            };
            _context.RestaurantTables.Add(table);
            await _context.SaveChangesAsync();
            var response = new TableResponse
            {
                Id = table.Id,
                Capacity = table.Capacity,
                TableNumber = table.TableNumber,
                IsOccupied = table.IsOccupied
            };
            return Ok(response);
        }

        [Authorize]
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableTables()
        {
            var tables = await _context.RestaurantTables
                .Where(t => !t.IsOccupied)
                .Select(t => new TableResponse
                {
                    Id = t.Id,
                    TableNumber = t.TableNumber,
                    Capacity = t.Capacity,
                    IsOccupied = t.IsOccupied
                })
                .ToListAsync();

            return Ok(tables);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllTables()
        {
            var tables = await _context.RestaurantTables.Select(t => new TableResponse
            {
                Id = t.Id,
                Capacity = t.Capacity,
                TableNumber = t.TableNumber,
                IsOccupied = t.IsOccupied
            }).ToListAsync();

            return Ok(tables);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTableById(int id)
        {
            var table = await _context.RestaurantTables.FindAsync(id);
            if (table == null)
            {
                return NotFound($"Table with ID {id} not found.");
            }
            var response = new TableResponse
            {
                Id = table.Id,
                Capacity = table.Capacity,
                TableNumber = table.TableNumber,
                IsOccupied = table.IsOccupied
            };
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/occupy")]
        public async Task<IActionResult> OccupyTable(int id)
        {
            var table = await _context.RestaurantTables.FindAsync(id);
            if(table == null)
            {
                return NotFound($"Table with ID {id} not found.");
            }
            if(table.IsOccupied)
            {
                return BadRequest($"Table with ID {id} is already occupied.");
            }

            table.IsOccupied = true;
            await _context.SaveChangesAsync();
            return Ok(new TableResponse
            {
                Id = table.Id,
                Capacity = table.Capacity,
                TableNumber = table.TableNumber,
                IsOccupied = table.IsOccupied
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/free")]
        public async Task<IActionResult> FreeTable(int id)
        {
            var table = await _context.RestaurantTables.FindAsync(id);
            if (table == null)
            {
                return NotFound($"Table with ID {id} not found.");
            }
            if (!table.IsOccupied)
            {
                return BadRequest($"Table with ID {id} is already Available.");
            }

            table.IsOccupied = false;
            await _context.SaveChangesAsync();
            return Ok(new TableResponse
            {
                Id = table.Id,
                Capacity = table.Capacity,
                TableNumber= table.TableNumber,
                IsOccupied = table.IsOccupied
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteTableById(int id)
        {
            var table = await _context.RestaurantTables.FirstOrDefaultAsync(r => r.Id == id);
            if(table == null)
            {
                return NotFound($"Table with ID {id} not found.");
            }

            _context.RestaurantTables.Remove(table);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Table deleted successfully."
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateTable(int id, UpdateTableRequest request)
        {

            var table = await _context.RestaurantTables.FirstOrDefaultAsync(r => r.Id == id);
            if (table == null)
            {
                return NotFound($"Table with ID {id} not found.");
            }

            if (request.Capacity <= 0 || request.Capacity > 20)
            {
                return BadRequest("Capacity must be between 1 and 20.");
            }

            var exists = await _context.RestaurantTables.AnyAsync(t =>
                t.Id != id &&
                t.TableNumber == request.TableNumber);

            if (exists)
            {
                return BadRequest("Table number already exists.");
            }

            table.Capacity = request.Capacity;
            table.TableNumber = request.TableNumber;

            await _context.SaveChangesAsync();

            return Ok(new TableResponse
            {
                Id = table.Id,
                TableNumber = table.TableNumber,
                Capacity = table.Capacity,
                IsOccupied = table.IsOccupied,

            });


        }

    }
}
