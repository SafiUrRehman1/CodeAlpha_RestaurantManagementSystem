namespace RestaurantManagementSystem.DTOs
{
    public class ReservationResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int TableId { get; set; }
        public int TableNumber { get; set; }
        public DateTime ReservationTime { get; set; }
        public string Status { get; set; } = string.Empty;

    }
}
