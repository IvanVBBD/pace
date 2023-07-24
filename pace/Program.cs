using Pace;
using Pace.interfaces;
using Pace.Usecases;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

try
{

    Console.WriteLine("Web service is running");
    CreateHostBuilder(args).Build().Run();
    return 0;
}
catch (AggregateException ex)
{
    string a = "cool";
    foreach (var innerException in ex.InnerExceptions)
    {
        Console.WriteLine(innerException.ToString());
    }
    return 1;
}
catch (Exception ex)
{
    Console.WriteLine(ex);
    return 1;
}


static IHostBuilder CreateHostBuilder(string[] args) =>
           Host.CreateDefaultBuilder(args)
                .ConfigureLogging(logging => logging.ClearProviders())
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });


