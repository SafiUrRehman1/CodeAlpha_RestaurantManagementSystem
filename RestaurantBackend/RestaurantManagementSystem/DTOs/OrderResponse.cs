namespace RestaurantManagementSystem.DTOs
{
    public class OrderResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
