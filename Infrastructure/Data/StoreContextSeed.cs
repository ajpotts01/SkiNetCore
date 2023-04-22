using System.Text.Json;
using Microsoft.Extensions.Logging;
using Core.Entities;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static List<T> LoadData<T>(string jsonPath) where T : BaseEntity
        {            
            var rawData = File.ReadAllText(jsonPath);
            var deserializedData = JsonSerializer.Deserialize<List<T>>(rawData);

            return deserializedData;
        }
        public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory)
        {
            const string BRANDS_JSON_PATH = "../Infrastructure/Data/SeedData/brands.json";
            const string TYPES_JSON_PATH = "../Infrastructure/Data/SeedData/types.json";
            const string PRODUCTS_JSON_PATH = "../Infrastructure/Data/SeedData/products.json";

            try
            {
                if (!context.ProductBrands.Any())
                    context.ProductBrands.AddRange(LoadData<ProductBrand>(BRANDS_JSON_PATH));

                if (!context.ProductTypes.Any())
                    context.ProductTypes.AddRange(LoadData<ProductType>(TYPES_JSON_PATH));
                
                if (!context.Products.Any())
                    context.Products.AddRange(LoadData<Product>(PRODUCTS_JSON_PATH));
                
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }
    }
}