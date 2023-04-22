using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using API.Extensions;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);

// Doesn't exist in my version of the project so far
//builder.Services.AddIdentityServices(builder.Configuration);

builder.Services.AddSwaggerDocumentation();

var app = builder.Build();

// Configure request pipeline (middleware)

app.UseMiddleware<ExceptionMiddleware>();

app.UseSwaggerDocumentation();                

app.UseStatusCodePagesWithReExecute("/errors/{0}");

app.UseHttpsRedirection();

app.UseRouting();

app.UseStaticFiles();

app.UseCors(ApplicationServicesExtensions.CORS_POLICY_LABEL);

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var loggerFactory = services.GetRequiredService<ILoggerFactory>();

    try
    {
        var context = services.GetRequiredService<StoreContext>();
        await context.Database.MigrateAsync();
        await StoreContextSeed.SeedAsync(context, loggerFactory);
    }
    catch (Exception ex)
    {
        var logger = loggerFactory.CreateLogger<Program>();
        logger.LogError(ex, "An error occurred during migration.");
    }
}

app.Run();