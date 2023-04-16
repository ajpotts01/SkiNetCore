using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using API.Helpers;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

namespace API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public const string CORS_POLICY_LABEL = "CorsPolicy";

        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            const string DEFAULT_CONN = "DefaultConnection";
            const string LOCALHOST_URL = "https://localhost:4200";

            
            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddControllers();
            services.AddDbContext<StoreContext>(x => x.UseSqlite(config.GetConnectionString(DEFAULT_CONN)));

            // Redis is designed to be shared/used amongst callers. Also thread-safe.
            services.AddSingleton<IConnectionMultiplexer>(c => {
                var configuration = ConfigurationOptions.Parse(config.GetConnectionString("Redis"), true);

                return ConnectionMultiplexer.Connect(configuration);
            });

            services.AddCors(
                opt => opt.AddPolicy(
                    CORS_POLICY_LABEL, pol => pol.AllowAnyHeader()
                                                 .AllowAnyMethod()
                                                 .WithOrigins(LOCALHOST_URL)
                                )
            );

            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IBasketRepository, BasketRepository>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

            services.Configure<ApiBehaviorOptions>(opts => 
            {
                opts.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errors = actionContext.ModelState
                                    .Where(e => e.Value.Errors.Count > 0)
                                    .SelectMany(x => x.Value.Errors)
                                    .Select(x => x.ErrorMessage)
                                    .ToArray();

                    var errorResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                    };

                    return new BadRequestObjectResult(errorResponse);
                };
            });     

            return services;       
        }
    }
}