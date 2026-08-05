namespace RestaurantManagementSystem.DTOs
{
    public class MyOrderResponse
    {
        public int Id { get; set; }

        public decimal TotalAmount { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
