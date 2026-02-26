namespace DEPI_AngApi.Models
{
    public class Order
    {
        public int Id { get; set; }
        public double Amount { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderProduct> orderProducts { get; set; }
        public int UserId { get; set; }
        public AppUser User { get; set; }
    }
}
