namespace RestaurantManagementSystem.DTOs
{
    public class RecentReservationDto
    {
        public string Customer { get; set; }

        public int TableNumber { get; set; }

        public DateTime Time { get; set; }
    }
}