namespace RestaurantManagementSystem.DTOs
{
    public class OrderItemResponse
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int MenuItemId { get; set; }
        public int Quantity { get; set; }
        public string MenuItemName { get; set; } = string.Empty;
    }
}
