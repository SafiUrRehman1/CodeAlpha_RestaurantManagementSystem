namespace RestaurantManagementSystem.DTOs
{
    public class RecentOrderDto
    {
        public string Customer { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }
    }
}