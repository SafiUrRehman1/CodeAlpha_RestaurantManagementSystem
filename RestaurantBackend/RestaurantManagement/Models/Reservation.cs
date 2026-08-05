namespace RestaurantManagementSystem.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int TableId { get; set; }
        public RestaurantTable Table { get; set; }
        public DateTime ReservationTime { get; set; }
        public string Status { get; set; } = "Pending";
    }
}
