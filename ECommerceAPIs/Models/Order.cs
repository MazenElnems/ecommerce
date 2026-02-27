namespace ECommerceAPIs.Models.Entities;

public class Order
{
    public int Id { get; set; }
    public double Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<OrderProduct> OrderProducts { get; set; } = new();
    public string UserId { get; set; } = string.Empty;
    public AppUser? User { get; set; }
}
