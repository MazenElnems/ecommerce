using ECommerceAPIs.Data;
using ECommerceAPIs.Models.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddAuthentication();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://127.0.0.1:5500")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddAuthorization();
builder.Services.AddScoped<DbInitializer>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbInitializer = scope.ServiceProvider.GetRequiredService<DbInitializer>();
    await dbInitializer.InitializeAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// يجب وضع UseCors قبل UseAuthorization
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapIdentityApi<AppUser>()
    .WithTags("Auth");

app.MapControllers();

app.Run();
