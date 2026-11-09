using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System.Data.SqlClient;

namespace WebApiGlobalFrio.Seguridad
{
    /// <summary>
    /// Convierte las excepciones en respuestas JSON con un campo message, que es lo que muestra la página:
    /// regla de negocio → 400 (o 404), base de datos caída → 503, cualquier otro error → 500.
    /// </summary>
    public class ManejoErroresFilter : IExceptionFilter
    {
        private readonly ILogger<ManejoErroresFilter> log;

        public ManejoErroresFilter(ILogger<ManejoErroresFilter> log)
        {
            this.log = log;
        }

        public void OnException(ExceptionContext context)
        {
            int status;
            string mensaje;

            if (context.Exception is Service.NegocioException negocio)
            {
                status = negocio.noEncontrado ? StatusCodes.Status404NotFound : StatusCodes.Status400BadRequest;
                mensaje = negocio.Message;
            }
            else if (context.Exception is SqlException)
            {
                log.LogError(context.Exception, "Error de base de datos");
                status = StatusCodes.Status503ServiceUnavailable;
                mensaje = "No se pudo conectar con la base de datos.";
            }
            else
            {
                log.LogError(context.Exception, "Error no controlado");
                status = StatusCodes.Status500InternalServerError;
                mensaje = "Ocurrió un error en el servidor.";
            }

            context.Result = new ObjectResult(new DTO.ErrorDTO { status = status, message = mensaje }) { StatusCode = status };
            context.ExceptionHandled = true;
        }
    }
}
