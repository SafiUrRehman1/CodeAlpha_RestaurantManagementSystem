namespace RestaurantManagementSystem.DTOs
{
    public class CreateMenuItemRequest
    {
        public string ItemName { get; set; }
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }
    }
}
