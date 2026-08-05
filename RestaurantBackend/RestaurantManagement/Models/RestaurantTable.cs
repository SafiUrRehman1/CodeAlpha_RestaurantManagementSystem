namespace RestaurantManagementSystem.Models
{
    public class RestaurantTable
    {
        public int Id { get; set; }

        public int TableNumber { get; set; }

        public int Capacity { get; set; }

        public bool IsOccupied { get; set; }
    }
}