namespace RestaurantManagementSystem.Models
{
    public class InventoryItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public int MinimumStock { get; set; }
    }
}
