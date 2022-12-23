using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

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
                // TODO: Figure out how to pass DbSets around and reduce code here even further
                if (!context.ProductBrands.Any())         
                    LoadData<ProductBrand>(BRANDS_JSON_PATH).ForEach(item => context.ProductBrands.Add(item));
                
                if (!context.ProductTypes.Any())
                    LoadData<ProductType>(TYPES_JSON_PATH).ForEach(item => context.ProductTypes.Add(item));
                
                if (!context.Products.Any())
                    LoadData<Product>(PRODUCTS_JSON_PATH).ForEach(item => context.Products.Add(item));
                
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