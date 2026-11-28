
namespace RestaurantManagementSystem.Models
{
    public class MenuItem
    {
        public int Id { get; set; }
        public required string ItemName { get; set; }
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }

        // External image URL, if the admin chooses URL instead of upload
        public string? ImageUrl { get; set; }

        // Uploaded image stored directly in SQL Server
        public byte[]? ImageData { get; set; }

        // Example: image/jpeg, image/png, image/webp
        public string? ImageContentType { get; set; }
    }
}
