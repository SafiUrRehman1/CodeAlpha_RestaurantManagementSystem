namespace RestaurantManagementSystem.Models
{
    public class MenuItem
    {
        public int Id { get; set; }
        public required string ItemName { get; set; }
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }
    }
}
