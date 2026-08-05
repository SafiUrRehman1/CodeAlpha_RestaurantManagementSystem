namespace RestaurantManagementSystem.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public  string Status { get; set; } = "Pending";
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
