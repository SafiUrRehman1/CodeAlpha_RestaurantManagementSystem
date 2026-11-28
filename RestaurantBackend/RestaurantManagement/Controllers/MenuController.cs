
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
        private const long MaxImageSize = 2 * 1024 * 1024;

        private static readonly string[] AllowedImageTypes =
        {
            "image/jpeg",
            "image/png",
            "image/webp"
        };

        public MenuController(AppDbContext context)
        {
            _context = context;
        }

        private MenuItemResponse MapResponse(MenuItem item)
        {
            return new MenuItemResponse
            {
                Id = item.Id,
                ItemName = item.ItemName,
                Price = item.Price,
                IsAvailable = item.IsAvailable,
                ImageUrl = item.ImageData != null
                    ? Url.Action(nameof(GetMenuItemImage), new { id = item.Id })
                    : item.ImageUrl
            };
        }

        private async Task<string?> SaveImageAsync(
            MenuItem item,
            IFormFile? imageFile,
            string? imageUrl)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                if (imageFile.Length > MaxImageSize)
                    throw new ArgumentException("Image size cannot exceed 2 MB.");

                if (!AllowedImageTypes.Contains(imageFile.ContentType.ToLowerInvariant()))
                    throw new ArgumentException("Only JPG, PNG, and WEBP images are allowed.");

                using var memoryStream = new MemoryStream();
                await imageFile.CopyToAsync(memoryStream);

                item.ImageData = memoryStream.ToArray();
                item.ImageContentType = imageFile.ContentType.ToLowerInvariant();
                item.ImageUrl = null;
            }
            else if (!string.IsNullOrWhiteSpace(imageUrl))
            {
                if (!Uri.TryCreate(imageUrl, UriKind.Absolute, out var uri) ||
                    (uri.Scheme != Uri.UriSchemeHttp &&
                     uri.Scheme != Uri.UriSchemeHttps))
                {
                    throw new ArgumentException("Please provide a valid HTTP or HTTPS image URL.");
                }

                item.ImageUrl = imageUrl.Trim();
                item.ImageData = null;
                item.ImageContentType = null;
            }

            return null;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddMenuItem(
            [FromForm] CreateMenuItemRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.ItemName))
                return BadRequest("Menu item name is required.");

            if (request.Price < 0)
                return BadRequest("Price cannot be negative.");

            if (request.ImageFile != null &&
                !string.IsNullOrWhiteSpace(request.ImageUrl))
                return BadRequest("Choose either an uploaded image or an image URL.");

            var alreadyExists = await _context.MenuItems
                .AnyAsync(m => m.ItemName == request.ItemName);

            if (alreadyExists)
                return BadRequest("Menu item with the same name already exists.");

            var menuItem = new MenuItem
            {
                ItemName = request.ItemName.Trim(),
                Price = request.Price,
                IsAvailable = request.IsAvailable
            };

            try
            {
                await SaveImageAsync(menuItem, request.ImageFile, request.ImageUrl);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            return Ok(MapResponse(menuItem));
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetMenuItems()
        {
            var menuItems = await _context.MenuItems
                .Where(m => m.IsAvailable)
                .ToListAsync();

            return Ok(menuItems.Select(MapResponse));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateMenuItem(
            int id,
            [FromForm] CreateMenuItemRequest request)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);

            if (menuItem == null)
                return NotFound();

            if (string.IsNullOrWhiteSpace(request.ItemName))
                return BadRequest("Menu item name is required.");

            if (request.Price < 0)
                return BadRequest("Price cannot be negative.");

            if (request.ImageFile != null &&
                !string.IsNullOrWhiteSpace(request.ImageUrl))
                return BadRequest("Choose either an uploaded image or an image URL.");

            var exists = await _context.MenuItems.AnyAsync(m =>
                m.ItemName == request.ItemName && m.Id != id);

            if (exists)
                return BadRequest("Another menu item with this name already exists.");

            menuItem.ItemName = request.ItemName.Trim();
            menuItem.Price = request.Price;
            menuItem.IsAvailable = request.IsAvailable;

            try
            {
                await SaveImageAsync(menuItem, request.ImageFile, request.ImageUrl);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

            await _context.SaveChangesAsync();

            return Ok(MapResponse(menuItem));
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllMenuItems()
        {
            var menuItems = await _context.MenuItems.ToListAsync();

            return Ok(menuItems.Select(MapResponse));
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetMenuItemById(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);

            if (menuItem == null)
                return NotFound();

            return Ok(MapResponse(menuItem));
        }

        [AllowAnonymous]
        [HttpGet("{id:int}/image")]
        public async Task<IActionResult> GetMenuItemImage(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);

            if (menuItem == null || menuItem.ImageData == null ||
                string.IsNullOrEmpty(menuItem.ImageContentType))
                return NotFound();

            return File(menuItem.ImageData, menuItem.ImageContentType);
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
                return NotFound();

            if (!menuItem.IsAvailable)
                return BadRequest("Menu item is already unavailable.");

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
                return NotFound();

            if (menuItem.IsAvailable)
                return BadRequest("Menu item is already available.");

            menuItem.IsAvailable = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
