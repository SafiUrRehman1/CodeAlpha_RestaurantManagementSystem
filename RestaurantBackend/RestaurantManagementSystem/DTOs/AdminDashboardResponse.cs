namespace RestaurantManagementSystem.DTOs
{
    public class AdminDashboardResponse
    {
        public int TotalCustomers { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalReservations { get; set; }
        public int LowStockItems { get; set; }
    }
}
