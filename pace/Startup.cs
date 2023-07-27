using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;
using Pace.interfaces;
using Pace.Usecases;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Pace
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });
            });
            services.AddSingleton<IDatabaseService, DatabaseService>();
            services.AddScoped<IScoreService, ScoreService>();
            services.AddSingleton<IWordService, WordService>();
            services.AddAuthorization();
            services.AddHealthChecks();
            services.AddControllers();
            services.AddHttpClient();

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            string a = "kek";
            if (!env.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            else
            {
                app.UseDeveloperExceptionPage();
                    //.UseCXSwaggerGeneration(provider);
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API v1");
            }
            );
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHealthChecks("/liveness",
                    new HealthCheckOptions()
                    {
                        Predicate = r => r.Tags.Contains("liveness")
                    });
                endpoints.MapHealthChecks("/health",
                    new HealthCheckOptions()
                    {
                        Predicate = r => r.Tags.Contains("readiness")
                    });
                endpoints.MapControllers();
            });


        }
    }
}
