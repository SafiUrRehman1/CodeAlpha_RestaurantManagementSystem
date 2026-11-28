
using Microsoft.AspNetCore.Http;

namespace RestaurantManagementSystem.DTOs
{
    public class CreateMenuItemRequest
    {
        public string ItemName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }

        // Option 1: Upload an image from the computer
        public IFormFile? ImageFile { get; set; }

        // Option 2: Provide an external image URL
        public string? ImageUrl { get; set; }
    }
}
