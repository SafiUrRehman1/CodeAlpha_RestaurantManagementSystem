namespace RestaurantManagementSystem.DTOs
{
    public class UpdateInventoryItemRequest
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public int MinimumStock { get; set; }
    }
}
