namespace RestaurantManagementSystem.DTOs
{
    public class InventoryItemResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public int MinimumStock { get; set; }

        public bool IsLowStock { get; set; }
    }
}
