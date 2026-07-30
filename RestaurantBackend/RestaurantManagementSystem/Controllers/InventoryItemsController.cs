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
    [Route("api/[controller]")]
    public class InventoryItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InventoryItemsController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]

        public async Task<IActionResult> CreateInventoryItem(CreateInventoryItemRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("Name is required.");
            }
            if (request.Quantity < 0)
            {
                return BadRequest("Quantity cannot be negative.");
            }
            if (request.MinimumStock < 0)
            {
                return BadRequest("Minimum stock cannot be negative.");
            }

            var exist = await _context.InventoryItems.AnyAsync(i => i.Name == request.Name);

            if (exist)
            {
                return BadRequest("An inventory item with the same name already exists.");
            }

            var inventoryItem = new InventoryItem
            {
                Name = request.Name,
                Quantity = request.Quantity,
                MinimumStock = request.MinimumStock
            };
            _context.InventoryItems.Add(inventoryItem);
            await _context.SaveChangesAsync();
            return Ok(new InventoryItemResponse
            {
                Id = inventoryItem.Id,
                Name = inventoryItem.Name,
                Quantity = inventoryItem.Quantity,
                MinimumStock = inventoryItem.MinimumStock
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]

        public async Task<IActionResult> GetAllInventoryItems()
        {
            var inventoryItems = await _context.InventoryItems.Select(i=> new InventoryItemResponse
            {
                Id = i.Id,
                Name = i.Name,
                Quantity = i.Quantity,
                MinimumStock = i.MinimumStock,
                IsLowStock = i.Quantity <= i.MinimumStock

            }).ToListAsync();

            return Ok(inventoryItems);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]

        public async Task<IActionResult> GetInventoryItemById(int id)
        {
            var inventoryItem = await _context.InventoryItems.FindAsync(id);
            if (inventoryItem == null)
            {
                return NotFound("Inventory item not found.");
            }
            return Ok(new InventoryItemResponse
            {
                Id = inventoryItem.Id,
                Name = inventoryItem.Name,
                Quantity = inventoryItem.Quantity,
                MinimumStock = inventoryItem.MinimumStock,
                IsLowStock = inventoryItem.Quantity <= inventoryItem.MinimumStock
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateInventoryItem(int id, UpdateInventoryItemRequest request)
        {
            var inventoryItem = await _context.InventoryItems.FindAsync(id);
            if (inventoryItem == null)
            {
                return NotFound("Inventory item not found.");
            }

            if (!string.IsNullOrWhiteSpace(request.Name))
            {

                var exist = await _context.InventoryItems.AnyAsync(i => i.Id != id && i.Name == request.Name);
                if (exist)
                {
                    return BadRequest("An inventory item with the same name already exists.");
                }
                inventoryItem.Name = request.Name;
            }

            if (request.Quantity < 0)
            {
                return BadRequest("Quantity cannot be negative.");
            }
            
                inventoryItem.Quantity = request.Quantity;


            if (request.MinimumStock < 0)
            {
                return BadRequest("Minimum stock cannot be negative.");
            }
                inventoryItem.MinimumStock = request.MinimumStock;

            await _context.SaveChangesAsync();
            return Ok(new InventoryItemResponse
            {
                Id = inventoryItem.Id,
                Name = inventoryItem.Name,
                Quantity = inventoryItem.Quantity,
                MinimumStock = inventoryItem.MinimumStock,
                IsLowStock = inventoryItem.Quantity <= inventoryItem.MinimumStock
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteInventoryItem(int id)
        {
            var inventoryItem = await _context.InventoryItems.FindAsync(id);
            if (inventoryItem == null)
            {
                return NotFound("Inventory item not found.");
            }
            _context.InventoryItems.Remove(inventoryItem);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Inventory item deleted successfully." });
        }
    }
}
