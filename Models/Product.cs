using System.ComponentModel.DataAnnotations;

namespace DEPI_AngApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
       
        public double Price { get; set; }
        public string Image { get; set; }

        public int ProductsInStock { get; set; }
        public int CategoryId { get; set; }
        // Navigation property
        public Category Category { get; set; }
        public List<OrderProduct> orderProducts { get; set; }
    }
}
