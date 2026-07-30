namespace RestaurantManagementSystem.DTOs
{
    public class CreateInventoryItemRequest
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public int MinimumStock { get; set; }
    }
}
