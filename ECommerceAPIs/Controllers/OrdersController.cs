using ECommerceAPIs.Data;
using ECommerceAPIs.Models;
using ECommerceAPIs.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPIs.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrdersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var userExists = await _context.Users.AnyAsync(u => u.Id == request.UserId);
        if (!userExists)
        {
            return BadRequest("Invalid user id.");
        }

        var mergedItems = request.Items
            .GroupBy(i => i.ProductId)
            .Select(g => new { ProductId = g.Key, Quantity = g.Sum(x => x.Quantity) })
            .ToList();

        var productIds = mergedItems.Select(i => i.ProductId).ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync();

        if (products.Count != productIds.Count)
        {
            return BadRequest("One or more products do not exist.");
        }

        foreach (var item in mergedItems)
        {
            var product = products.First(p => p.Id == item.ProductId);
            if (product.ProductsInStock < item.Quantity)
            {
                return BadRequest($"Insufficient stock for product id {item.ProductId}.");
            }
        }

        var order = new Order
        {
            UserId = request.UserId,
            CreatedAt = DateTime.UtcNow,
            Status = "Pending",
            Amount = 0
        };

        foreach (var item in mergedItems)
        {
            var product = products.First(p => p.Id == item.ProductId);
            product.ProductsInStock -= item.Quantity;

            order.Amount += product.Price * item.Quantity;
            order.OrderProducts.Add(new OrderProduct
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity
            });
        }

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return Created($"/api/orders/{order.Id}", new
        {
            order.Id,
            order.UserId,
            order.Amount,
            order.Status,
            order.CreatedAt
        });
    }
}
