using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantManagementSystem.Data;
using RestaurantManagementSystem.Models;
using RestaurantManagementSystem.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace RestaurantManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderRequest request)

        {

            Console.WriteLine("===== CREATE ORDER =====");
            Console.WriteLine($"Items null? {request.Items == null}");
            Console.WriteLine($"Items count: {request.Items?.Count}");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            if (request.Items == null || !request.Items.Any())
            {
                return BadRequest("Order must contain at least one item.");
            }

            var order = new Order
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending",
                TotalAmount = 0
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            decimal totalAmount = 0;

            foreach (var item in request.Items)
            {
                Console.WriteLine($"MenuItemId = {item.MenuItemId}");
                Console.WriteLine($"Quantity = {item.Quantity}");

                if (item.Quantity <= 0)
                {
                    return BadRequest("Quantity must be greater than zero.");
                }

                var menuItem = await _context.MenuItems
                    .FirstOrDefaultAsync(m =>
                        m.Id == item.MenuItemId &&
                        m.IsAvailable);

                if (menuItem == null)
                {
                    return BadRequest($"Menu item with id {item.MenuItemId} not found or unavailable.");
                }

                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    MenuItemId = menuItem.Id,
                    Quantity = item.Quantity
                };

                _context.OrderItems.Add(orderItem);

                totalAmount += menuItem.Price * item.Quantity;
            }

            order.TotalAmount = totalAmount;

            await _context.SaveChangesAsync();

            return Ok(new OrderResponse
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,
                Status = order.Status
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderResponse
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    CustomerName = o.User.Name,
                    TotalAmount = o.TotalAmount,
                    CreatedAt = o.CreatedAt,
                    Status = o.Status
                })
                .ToListAsync();

            return Ok(orders);
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound("Order not found.");
            }

            return Ok(new OrderDetailsResponse
            {
                Id = order.Id,
                CustomerName = order.User.Name,
                CustomerEmail = order.User.Email,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,
                Status = order.Status,

                Items = order.OrderItems.Select(oi => new OrderItemDetailsResponse
                {
                    MenuItemId = oi.MenuItemId,
                    MenuItemName = oi.MenuItem.ItemName,
                    Quantity = oi.Quantity,
                    Price = oi.MenuItem.Price,
                    Subtotal = oi.Quantity * oi.MenuItem.Price,
                }).ToList()
            });
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(
             int id,
             UpdateOrderStatusRequest request)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound("Order not found.");
            }

            var validStatuses = new[]
            {
        "Pending",
        "Preparing",
        "Ready",
        "Completed",
        "Cancelled"
    };

            if (!validStatuses.Contains(request.Status))
            {
                return BadRequest("Invalid status.");
            }

            order.Status = request.Status;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Order status updated successfully."
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
            {
                return NotFound("Order not found.");
            }
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return Ok("Order deleted successfully.");
        }

        [Authorize]
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new MyOrderResponse
                {
                    Id = o.Id,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync();

            return Ok(orders);
        }

        [Authorize]
        [HttpGet("my-orders/{id}")]
        public async Task<IActionResult> GetMyOrderById(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .FirstOrDefaultAsync(o =>
                    o.Id == id &&
                    o.UserId == userId);

            if (order == null)
            {
                return NotFound("Order not found.");
            }

            return Ok(new OrderDetailsResponse
            {
                Id = order.Id,
                CustomerName = order.User.Name,
                CustomerEmail = order.User.Email,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreatedAt = order.CreatedAt,

                Items = order.OrderItems.Select(oi => new OrderItemDetailsResponse
                {
                    MenuItemId = oi.MenuItemId,
                    MenuItemName = oi.MenuItem.ItemName,
                    Quantity = oi.Quantity,
                    Price = oi.MenuItem.Price,
                    Subtotal = oi.MenuItem.Price * oi.Quantity,
                }).ToList()
            });
        }
    }
}
