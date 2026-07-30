public class OrderDetailsResponse
{
    public int Id { get; set; }

    public string CustomerName { get; set; }

    public string CustomerEmail { get; set; }

    public string Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public decimal TotalAmount { get; set; }

    public List<OrderItemDetailsResponse> Items { get; set; } = new List<OrderItemDetailsResponse>();
}