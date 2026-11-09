using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace WebApiGlobalFrio
{
    public class Program
    {
        public static void Main(string[] args)
        {
            IHost host = CreateHostBuilder(args).Build();
            PrepararBaseDatos(host);
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        /// <summary>
        /// Si en appsettings.json BaseDatos:CrearSiNoExiste es true y la base todavía no existe,
        /// la crea con database/BD_GLOBALFRIO.sql (tablas, datos y procedimientos almacenados).
        /// </summary>
        private static void PrepararBaseDatos(IHost host)
        {
            var configuracion = host.Services.GetRequiredService<IConfiguration>();
            var log = host.Services.GetRequiredService<ILogger<Program>>();

            if (!configuracion.GetValue<bool>("BaseDatos:CrearSiNoExiste"))
            {
                return;
            }

            try
            {
                string cnBD = configuracion.GetConnectionString("cn_bd_globalfrio");
                string script = Path.Combine(AppContext.BaseDirectory, "database", "BD_GLOBALFRIO.sql");
                bool creada = new Data.InicializadorBD(cnBD).crearSiNoExiste(script);
                log.LogInformation(creada
                    ? "Base de datos globalfrio_db creada con sus tablas, datos y procedimientos."
                    : "Base de datos globalfrio_db encontrada.");
            }
            catch (Exception ex)
            {
                log.LogError(ex, "No se pudo preparar la base de datos. Revisa la cadena de conexión en appsettings.json.");
            }
        }
    }
}
