namespace ECommerceAPIs.Models.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Price { get; set; }
    public string Image { get; set; } = string.Empty;
    public int ProductsInStock { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public List<OrderProduct> OrderProducts { get; set; } = new();
}
