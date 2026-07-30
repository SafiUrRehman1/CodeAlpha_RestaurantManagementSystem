namespace RestaurantManagementSystem.DTOs
{
    public class RecentOrderResponse
    {
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerEmail { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
