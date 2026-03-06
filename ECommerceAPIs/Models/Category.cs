namespace ECommerceAPIs.Models.Entities;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Image { get; set; }
    public List<Product> Products { get; set; } = new();
}
