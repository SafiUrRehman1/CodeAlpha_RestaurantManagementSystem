using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using RestaurantManagementSystem.Data;
using RestaurantManagementSystem.DTOs;
using RestaurantManagementSystem.Models;
using Microsoft.AspNetCore.Authorization;

namespace RestaurantManagementSystem.Controllers
{
    [ApiController]
    [Route("Api/[Controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AdminController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet("dashboard")]

        public async Task<IActionResult> GetDashboard()
        {
            var customerCount = await _context.Users.CountAsync(u => u.Role == "Customer");

            var orderCount = await _context.Orders.CountAsync();

            var totalRevenue = await _context.Orders
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0; 
            
            var totalReservations = await _context.Reservations.CountAsync();

            var lowStockItems = await _context.InventoryItems.CountAsync(i=>i.Quantity<= i.MinimumStock);

            return Ok(new AdminDashboardResponse
            {
                TotalCustomers = customerCount,
                TotalOrders = orderCount,
                TotalRevenue = totalRevenue,
                TotalReservations = totalReservations,
                LowStockItems = lowStockItems

            });
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStockItems()
        {
            var lowStockItems = await _context.InventoryItems
                .Where(i => i.Quantity <= i.MinimumStock)
                .Select(i => new InventoryItemResponse
                {
                    Id = i.Id,
                    Name = i.Name,
                    Quantity = i.Quantity,
                    MinimumStock = i.MinimumStock,
                    IsLowStock = true
                })
                .ToListAsync();


            return Ok(lowStockItems);

        }

        [HttpGet("recent-orders")]
        public async Task<IActionResult> GetRecentOrders()
        {
            var recentOrders = await _context.Orders.OrderByDescending(o => o.CreatedAt).Take(5)
                .Select(o => new RecentOrderResponse
                {
                    OrderId = o.Id,
                    CustomerId = o.UserId,
                    CustomerEmail = o.User.Email,
                    TotalAmount = o.TotalAmount,
                    CreatedAt = o.CreatedAt,
                })
                .ToListAsync();

            return Ok(recentOrders);
        }


        [HttpGet("recent-reservations")]
        public async Task<IActionResult> GetRecentReservations()
        {
            var recentReservations = await _context.Reservations.OrderByDescending(r => r.ReservationTime).Take(5)
                .Select(r => new RecentReservationsResponse
                {
                    ReservationId = r.Id,
                    CustomerEmail = r.User.Email,
                    TableId = r.TableId,
                    ReservationTime = r.ReservationTime,

                })
                .ToListAsync();

            return Ok(recentReservations);
        }

        [HttpGet("top-selling-items")]

        public async Task<IActionResult> GetTopSellingItems()
        {
            var topSellingItems = await _context.OrderItems.GroupBy(oi => new
            {
                oi.MenuItemId,
                oi.MenuItem.ItemName
            }).Select(g => new TopSellingMenuItemResponse
            {
                MenuItemId = g.Key.MenuItemId,
                MenuItemName = g.Key.ItemName,
                TotalSold = g.Sum(x => x.Quantity)

            }).OrderByDescending(x => x.TotalSold)
            .Take(5)
            .ToListAsync();

            return Ok(topSellingItems);
        }
    }
}
