namespace RestaurantManagementSystem.DTOs
{
    public class RecentReservationsResponse
    {
        public int ReservationId { get; set; }
        public string CustomerEmail { get; set; }
        public int TableId { get; set; }
        public DateTime ReservationTime { get; set; }
    }
}
