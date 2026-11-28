
namespace RestaurantManagementSystem.DTOs
{
    public class MenuItemResponse
    {
        public int Id { get; set; }
        public string ItemName { get; set; }
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }

        // Image URL returned to the frontend
        public string? ImageUrl { get; set; }
    }
}
