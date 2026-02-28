using ECommerceAPIs.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPIs.Data;

public class DbInitializer
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<AppUser> _userManager;
    private readonly ILogger<DbInitializer> _logger;

    public DbInitializer(
        ApplicationDbContext context,
        UserManager<AppUser> userManager,
        ILogger<DbInitializer> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        await _context.Database.MigrateAsync();
        await SeedCategoriesAndProductsAsync();
        await SeedUsersAsync();
    }

    private async Task SeedCategoriesAndProductsAsync()
    {
        if (await _context.Categories.AnyAsync())
        {
            return;
        }

        var categories = new List<Category>
        {
            new()
            {
                Name = "Electronics",
                Image = "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
                Products =
                [
                    new Product
                    {
                        Name = "Wireless Headphones",
                        Description = "Noise-canceling over-ear Bluetooth headphones.",
                        Price = 129.99,
                        ProductsInStock = 40,
                        Image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
                    },
                    new Product
                    {
                        Name = "Smart Watch",
                        Description = "Fitness and notification smart watch with AMOLED display.",
                        Price = 199.99,
                        ProductsInStock = 25,
                        Image = "https://images.unsplash.com/photo-1546868871-7041f2a55e12"
                    },
                    new Product
                    {
                        Name = "Bluetooth Speaker",
                        Description = "Portable speaker with deep bass and long battery life.",
                        Price = 79.99,
                        ProductsInStock = 55,
                        Image = "https://images.unsplash.com/photo-1589003077984-894e133dabab"
                    },
                    new Product
                    {
                        Name = "Gaming Mouse",
                        Description = "Ergonomic RGB gaming mouse with programmable buttons.",
                        Price = 49.99,
                        ProductsInStock = 70,
                        Image = "https://images.unsplash.com/photo-1527814050087-3793815479db"
                    },
                    new Product
                    {
                        Name = "Mechanical Keyboard",
                        Description = "Tactile mechanical keyboard for office and gaming.",
                        Price = 109.99,
                        ProductsInStock = 38,
                        Image = "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae"
                    },
                    new Product
                    {
                        Name = "4K Monitor",
                        Description = "27-inch 4K UHD display with vivid colors.",
                        Price = 299.99,
                        ProductsInStock = 22,
                        Image = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"
                    },
                    new Product
                    {
                        Name = "Webcam",
                        Description = "1080p webcam with autofocus and dual microphones.",
                        Price = 59.99,
                        ProductsInStock = 45,
                        Image = "https://images.unsplash.com/photo-1587829741301-dc798b83add3"
                    },
                    new Product
                    {
                        Name = "External SSD 1TB",
                        Description = "High-speed USB-C external solid state drive.",
                        Price = 139.99,
                        ProductsInStock = 34,
                        Image = "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea"
                    },
                    new Product
                    {
                        Name = "Wireless Charger",
                        Description = "Fast charging pad compatible with modern smartphones.",
                        Price = 29.99,
                        ProductsInStock = 90,
                        Image = "https://images.unsplash.com/photo-1587033411391-5d9e51cce126"
                    },
                    new Product
                    {
                        Name = "Noise-Canceling Earbuds",
                        Description = "Compact true wireless earbuds with ANC support.",
                        Price = 119.99,
                        ProductsInStock = 47,
                        Image = "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46"
                    }
                ]
            },
            new()
            {
                Name = "Fashion",
                Image = "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
                Products =
                [
                    new Product
                    {
                        Name = "Classic Denim Jacket",
                        Description = "Comfortable unisex denim jacket for everyday wear.",
                        Price = 79.50,
                        ProductsInStock = 30,
                        Image = "https://images.unsplash.com/photo-1544022613-e87ca75a784a"
                    },
                    new Product
                    {
                        Name = "Running Sneakers",
                        Description = "Lightweight breathable running shoes.",
                        Price = 89.99,
                        ProductsInStock = 50,
                        Image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                    },
                    new Product
                    {
                        Name = "Cotton T-Shirt",
                        Description = "Soft everyday t-shirt made from 100% cotton.",
                        Price = 19.99,
                        ProductsInStock = 120,
                        Image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
                    },
                    new Product
                    {
                        Name = "Slim Fit Jeans",
                        Description = "Stretch slim fit jeans with modern style.",
                        Price = 49.99,
                        ProductsInStock = 80,
                        Image = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
                    },
                    new Product
                    {
                        Name = "Leather Belt",
                        Description = "Durable genuine leather belt for daily wear.",
                        Price = 24.99,
                        ProductsInStock = 65,
                        Image = "https://images.unsplash.com/photo-1618886487325-f665032b6358"
                    },
                    new Product
                    {
                        Name = "Hooded Sweatshirt",
                        Description = "Warm fleece hoodie suitable for all seasons.",
                        Price = 39.99,
                        ProductsInStock = 75,
                        Image = "https://images.unsplash.com/photo-1521577352947-9bb58764b69a"
                    },
                    new Product
                    {
                        Name = "Sunglasses",
                        Description = "UV-protected stylish sunglasses.",
                        Price = 34.99,
                        ProductsInStock = 90,
                        Image = "https://images.unsplash.com/photo-1511499767150-a48a237f0083"
                    },
                    new Product
                    {
                        Name = "Canvas Backpack",
                        Description = "Spacious backpack for work, school, and travel.",
                        Price = 54.99,
                        ProductsInStock = 40,
                        Image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
                    },
                    new Product
                    {
                        Name = "Wrist Watch",
                        Description = "Minimal analog watch with stainless steel strap.",
                        Price = 69.99,
                        ProductsInStock = 48,
                        Image = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49"
                    },
                    new Product
                    {
                        Name = "Beanie Hat",
                        Description = "Cozy knitted beanie for winter comfort.",
                        Price = 14.99,
                        ProductsInStock = 110,
                        Image = "https://images.unsplash.com/photo-1521369909029-2afed882baee"
                    }
                ]
            },
            new()
            {
                Name = "Home Appliances",
                Image = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f",
                Products =
                [
                    new Product
                    {
                        Name = "Air Fryer",
                        Description = "Digital air fryer with rapid hot air circulation.",
                        Price = 149.00,
                        ProductsInStock = 18,
                        Image = "https://images.unsplash.com/photo-1585515320310-259814833e62"
                    },
                    new Product
                    {
                        Name = "Blender",
                        Description = "High-speed blender for smoothies and soups.",
                        Price = 64.99,
                        ProductsInStock = 35,
                        Image = "https://images.unsplash.com/photo-1570222094114-d054a817e56b"
                    },
                    new Product
                    {
                        Name = "Vacuum Cleaner",
                        Description = "Bagless vacuum cleaner with HEPA filter.",
                        Price = 189.99,
                        ProductsInStock = 20,
                        Image = "https://images.unsplash.com/photo-1558317374-067fb5f30001"
                    },
                    new Product
                    {
                        Name = "Microwave Oven",
                        Description = "Countertop microwave with quick heat presets.",
                        Price = 129.99,
                        ProductsInStock = 26,
                        Image = "https://images.unsplash.com/photo-1585659722983-3a675dabf23d"
                    },
                    new Product
                    {
                        Name = "Electric Kettle",
                        Description = "Stainless steel fast-boil electric kettle.",
                        Price = 39.99,
                        ProductsInStock = 58,
                        Image = "https://images.unsplash.com/photo-1517774928540-9a8b86f2f460"
                    },
                    new Product
                    {
                        Name = "Coffee Maker",
                        Description = "Programmable drip coffee maker with timer.",
                        Price = 89.99,
                        ProductsInStock = 31,
                        Image = "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6"
                    },
                    new Product
                    {
                        Name = "Toaster",
                        Description = "2-slice toaster with browning control.",
                        Price = 29.99,
                        ProductsInStock = 72,
                        Image = "https://images.unsplash.com/photo-1585238342024-78d387f4a707"
                    },
                    new Product
                    {
                        Name = "Rice Cooker",
                        Description = "Automatic rice cooker with warm mode.",
                        Price = 54.99,
                        ProductsInStock = 44,
                        Image = "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1"
                    },
                    new Product
                    {
                        Name = "Steam Iron",
                        Description = "Non-stick steam iron for wrinkle-free clothes.",
                        Price = 34.99,
                        ProductsInStock = 66,
                        Image = "https://images.unsplash.com/photo-1616627981458-51152d8f9284"
                    },
                    new Product
                    {
                        Name = "Water Dispenser",
                        Description = "Hot and cold standing water dispenser.",
                        Price = 159.99,
                        ProductsInStock = 15,
                        Image = "https://images.unsplash.com/photo-1585032226651-759b368d7246"
                    }
                ]
            },
            new()
            {
                Name = "Books",
                Image = "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
                Products =
                [
                    new Product
                    {
                        Name = "Clean Code",
                        Description = "A handbook of agile software craftsmanship.",
                        Price = 32.00,
                        ProductsInStock = 60,
                        Image = "https://images.unsplash.com/photo-1512820790803-83ca734da794"
                    },
                    new Product
                    {
                        Name = "The Pragmatic Programmer",
                        Description = "Practical software engineering principles and tips.",
                        Price = 36.50,
                        ProductsInStock = 45,
                        Image = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570"
                    },
                    new Product
                    {
                        Name = "Atomic Habits",
                        Description = "A practical guide to building good habits.",
                        Price = 21.99,
                        ProductsInStock = 70,
                        Image = "https://images.unsplash.com/photo-1474932430478-367dbb6832c1"
                    },
                    new Product
                    {
                        Name = "Deep Work",
                        Description = "Rules for focused success in a distracted world.",
                        Price = 24.99,
                        ProductsInStock = 52,
                        Image = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8"
                    },
                    new Product
                    {
                        Name = "Design Patterns",
                        Description = "Elements of reusable object-oriented software.",
                        Price = 44.99,
                        ProductsInStock = 33,
                        Image = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6"
                    },
                    new Product
                    {
                        Name = "Refactoring",
                        Description = "Improving the design of existing code.",
                        Price = 39.99,
                        ProductsInStock = 28,
                        Image = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                    },
                    new Product
                    {
                        Name = "The Clean Coder",
                        Description = "A code of conduct for professional programmers.",
                        Price = 29.99,
                        ProductsInStock = 47,
                        Image = "https://images.unsplash.com/photo-1507842217343-583bb7270b66"
                    },
                    new Product
                    {
                        Name = "Domain-Driven Design",
                        Description = "Tackling complexity in software architecture.",
                        Price = 49.99,
                        ProductsInStock = 21,
                        Image = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570"
                    },
                    new Product
                    {
                        Name = "The Phoenix Project",
                        Description = "A novel about IT, DevOps, and business success.",
                        Price = 22.99,
                        ProductsInStock = 39,
                        Image = "https://images.unsplash.com/photo-1519682337058-a94d519337bc"
                    },
                    new Product
                    {
                        Name = "Cracking the Coding Interview",
                        Description = "Comprehensive interview prep for software engineers.",
                        Price = 34.99,
                        ProductsInStock = 42,
                        Image = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570"
                    }
                ]
            },
            new()
            {
                Name = "Sports & Fitness",
                Image = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
                Products =
                [
                    new Product
                    {
                        Name = "Yoga Mat",
                        Description = "Non-slip yoga mat for workouts and stretching.",
                        Price = 25.99,
                        ProductsInStock = 85,
                        Image = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
                    },
                    new Product
                    {
                        Name = "Dumbbell Set",
                        Description = "Adjustable dumbbells for home gym training.",
                        Price = 119.99,
                        ProductsInStock = 24,
                        Image = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61"
                    },
                    new Product
                    {
                        Name = "Resistance Bands",
                        Description = "Set of 5 resistance bands for strength training.",
                        Price = 18.99,
                        ProductsInStock = 100,
                        Image = "https://images.unsplash.com/photo-1599058917212-d750089bc07e"
                    },
                    new Product
                    {
                        Name = "Treadmill",
                        Description = "Foldable treadmill with digital display.",
                        Price = 599.99,
                        ProductsInStock = 10,
                        Image = "https://images.unsplash.com/photo-1598971639058-a3a6c6f50b3f"
                    },
                    new Product
                    {
                        Name = "Skipping Rope",
                        Description = "Adjustable jump rope for cardio workouts.",
                        Price = 12.99,
                        ProductsInStock = 140,
                        Image = "https://images.unsplash.com/photo-1521804906057-1df8fdb718b7"
                    },
                    new Product
                    {
                        Name = "Protein Shaker Bottle",
                        Description = "Leak-proof shaker bottle with mixing ball.",
                        Price = 9.99,
                        ProductsInStock = 160,
                        Image = "https://images.unsplash.com/photo-1593079831268-3381b0db4a77"
                    },
                    new Product
                    {
                        Name = "Kettlebell 12kg",
                        Description = "Cast iron kettlebell for functional training.",
                        Price = 44.99,
                        ProductsInStock = 36,
                        Image = "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa"
                    },
                    new Product
                    {
                        Name = "Cycling Helmet",
                        Description = "Lightweight helmet with ventilation channels.",
                        Price = 39.99,
                        ProductsInStock = 58,
                        Image = "https://images.unsplash.com/photo-1518655048521-f130df041f66"
                    },
                    new Product
                    {
                        Name = "Gym Gloves",
                        Description = "Breathable anti-slip gloves for weight training.",
                        Price = 14.99,
                        ProductsInStock = 95,
                        Image = "https://images.unsplash.com/photo-1518611012118-696072aa579a"
                    },
                    new Product
                    {
                        Name = "Foam Roller",
                        Description = "High-density foam roller for muscle recovery.",
                        Price = 21.99,
                        ProductsInStock = 62,
                        Image = "https://images.unsplash.com/photo-1518310383802-640c2de311b2"
                    }
                ]
            }
        };

        await _context.Categories.AddRangeAsync(categories);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Default categories and products seeded.");
    }

    private async Task SeedUsersAsync()
    {
        var defaultUsers = new[]
        {
            new { UserName = "admin.user", Email = "admin@ecommerce.local", Password = "P@ssw0rd!" },
            new { UserName = "customer.user", Email = "customer@ecommerce.local", Password = "P@ssw0rd!" }
        };

        foreach (var defaultUser in defaultUsers)
        {
            var exists = await _userManager.FindByEmailAsync(defaultUser.Email);
            if (exists is not null)
            {
                continue;
            }

            var user = new AppUser
            {
                UserName = defaultUser.UserName,
                Email = defaultUser.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, defaultUser.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                _logger.LogWarning("Failed to seed user {Email}: {Errors}", defaultUser.Email, errors);
            }
        }
    }
}
