        namespace RestaurantManagementSystem.DTOs
    {
        public class DashboardResponse
        {
            public int Customers { get; set; }

            public int Orders { get; set; }

            public int Reservations { get; set; }

            public decimal Revenue { get; set; }

            public int LowStock { get; set; }

            public List<RecentOrderDto> RecentOrders { get; set; } = new List<RecentOrderDto>();

            public List<RecentReservationDto> RecentReservations { get; set; } =new List<RecentReservationDto>();

            public List<LowStockItemDto> LowStockItems { get; set; } = new List<LowStockItemDto>();

            public List<TopSellingItemDto> TopSellingItems { get; set; } = new List<TopSellingItemDto>();
    }
    }
