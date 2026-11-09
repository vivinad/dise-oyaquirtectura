using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace WebApiGlobalFrio
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
            // Auto Mapper Configurations
            var mappingConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new AutomapperHelper());
            });
            IMapper mapper = mappingConfig.CreateMapper();
            services.AddSingleton(mapper);

            // Los errores de negocio y de base de datos se responden con un mensaje claro para la página.
            services.AddControllers(options =>
            {
                options.Filters.Add<Seguridad.ManejoErroresFilter>();
            });

            // La página en Angular (http://localhost:4200) llama a esta API.
            services.AddCors(options =>
            {
                options.AddPolicy("PaginaWeb", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "WebApiGlobalFrio",
                    Version = "v1",
                    Description = "API de la página de Global Frío: contenido de la página de inicio y cotizador en línea. "
                                + "Curso Diseño y Arquitectura de Software - UPN."
                });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApiGlobalFrio v1"));

            app.UseRouting();
            app.UseCors("PaginaWeb");

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
