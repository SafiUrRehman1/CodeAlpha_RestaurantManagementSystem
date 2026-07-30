namespace RestaurantManagementSystem.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string Role { get; set; }

        public DateTime CreatedAt { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
