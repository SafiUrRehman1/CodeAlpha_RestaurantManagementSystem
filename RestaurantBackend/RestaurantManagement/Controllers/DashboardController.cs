using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantManagementSystem.Data;
using RestaurantManagementSystem.DTOs;

namespace RestaurantManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var customers = await _context.Users
                .CountAsync(u => u.Role == "Customer");

            var orders = await _context.Orders.CountAsync();

            var reservations = await _context.Reservations.CountAsync();

            var revenue = await _context.Orders
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

            var lowStock = await _context.InventoryItems
                .CountAsync(i => i.Quantity <= i.MinimumStock);

            var recentOrders = await _context.Orders
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .Take(5)
                .Select(o => new RecentOrderDto
                {
                    Customer = o.User.Email,
                    Amount = o.TotalAmount,
                    Date = o.CreatedAt
                })
                .ToListAsync();


            var recentReservations = await _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Table)
                .OrderByDescending(r => r.ReservationTime)
                .Take(5)
                .Select(r => new RecentReservationDto
                {
                    Customer = r.User.Email,
                    TableNumber = r.Table.TableNumber,
                    Time = r.ReservationTime
                })
                .ToListAsync();


            var lowStockItems = await _context.InventoryItems
                .Where(i => i.Quantity <= i.MinimumStock)
                .OrderBy(i => i.Quantity)
                .Take(5)
                .Select(i => new LowStockItemDto
                {
                    Name = i.Name,
                    Quantity = i.Quantity
                })
                .ToListAsync();

            
            var topSellingItems = await _context.OrderItems
                .Include(oi => oi.MenuItem)
                .GroupBy(oi => new
                {
                    oi.MenuItemId,
                    oi.MenuItem.ItemName,
                })
                .Select(g => new TopSellingItemDto
                {
                    Name = g.Key.ItemName,
                    Sold = g.Sum(x => x.Quantity)
                })
                .OrderByDescending(x => x.Sold)
                .Take(5)
                .ToListAsync();

            
            var response = new DashboardResponse
            {
                Customers = customers,
                Orders = orders,
                Reservations = reservations,
                Revenue = revenue,
                LowStock = lowStock,

                RecentOrders = recentOrders,
                RecentReservations = recentReservations,
                LowStockItems = lowStockItems,
                TopSellingItems = topSellingItems
            };

            return Ok(response);
        }
    }
}