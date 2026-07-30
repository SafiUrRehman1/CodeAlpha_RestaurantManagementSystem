using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using RestaurantManagementSystem.Data;
using RestaurantManagementSystem.Models;
using RestaurantManagementSystem.DTOs;

namespace RestaurantManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class MenuController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MenuController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddMenuItem(CreateMenuItemRequest request)
        {

            if (string.IsNullOrWhiteSpace(request.ItemName))
            {
                return BadRequest("Menu item name is required.");
            }
                
            if (request.Price < 0)
            {
                return BadRequest("Price cannot be negative.");
            }

            var alreadyExists = await _context.MenuItems.AnyAsync(m => m.ItemName == request.ItemName);
            if (alreadyExists)
            {
                return BadRequest("Menu item with the same name already exists.");
            }

            var menuItem = new MenuItem
            {
                ItemName = request.ItemName,
                Price = request.Price,
                IsAvailable = request.IsAvailable
            };

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            return Ok(new MenuItemResponse
            {
                Id = menuItem.Id,
                ItemName = menuItem.ItemName,
                Price = menuItem.Price,
                IsAvailable = menuItem.IsAvailable
            });
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetMenuItems()
        {
            var menuItems = await _context.MenuItems
                .Where(m=> m.IsAvailable)
                .Select(m => new MenuItemResponse
                {
                    Id = m.Id,
                    ItemName = m.ItemName,
                    Price = m.Price,
                    IsAvailable = m.IsAvailable
                })
                .ToListAsync();
            return Ok(menuItems);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenuItem(int id, CreateMenuItemRequest request)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);

            if (menuItem == null)
                return NotFound();

            if (string.IsNullOrWhiteSpace(request.ItemName))
                return BadRequest("Menu item name is required.");

            if (request.Price < 0)
                return BadRequest("Price cannot be negative.");

            var exists = await _context.MenuItems.AnyAsync(m =>
                m.ItemName == request.ItemName &&
                m.Id != id);

            if (exists)
                return BadRequest("Another menu item with this name already exists.");

            menuItem.ItemName = request.ItemName;
            menuItem.Price = request.Price;
            menuItem.IsAvailable = request.IsAvailable;

            await _context.SaveChangesAsync();

            return Ok(new MenuItemResponse
            {
                Id = menuItem.Id,
                ItemName = menuItem.ItemName,
                Price = menuItem.Price,
                IsAvailable = menuItem.IsAvailable
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllMenuItems()
        {
            var menuItems = await _context.MenuItems
                .Select(m => new MenuItemResponse
                {
                    Id = m.Id,
                    ItemName = m.ItemName,
                    Price = m.Price,
                    IsAvailable = m.IsAvailable
                })
                .ToListAsync();

            return Ok(menuItems);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetMenuItemById(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }
            var response = new MenuItemResponse
            {
                Id = menuItem.Id,
                ItemName = menuItem.ItemName,
                Price = menuItem.Price,
                IsAvailable = menuItem.IsAvailable
            };
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);

            if (menuItem == null)
                return NotFound();

            _context.MenuItems.Remove(menuItem);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/disable")]

        public async Task<IActionResult> DisableMenuItem(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }
            if (!menuItem.IsAvailable)
            {
                return BadRequest("Menu item is already unavailable.");
            }
            menuItem.IsAvailable = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/enable")]

        public async Task<IActionResult> EnableMenuItem(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }
            if (menuItem.IsAvailable)
            {
                return BadRequest("Menu item is already available.");
            }
            menuItem.IsAvailable = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }


    }
}
