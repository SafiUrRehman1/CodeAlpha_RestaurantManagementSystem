namespace RestaurantManagementSystem.DTOs
{
    public class CreateReservationRequest
    {
        public int TableId { get; set; }
        public DateTime ReservationTime { get; set; }
    }
}
