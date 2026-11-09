using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace WebApiGlobalFrio.Controllers
{
    /// <summary>
    /// Muestra si la API está conectada a la base de datos y cuántos registros tiene cada tabla.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class EstadoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string cnBD = "";
        private Service.EstadoSER objBss;
        private readonly IMapper mapper;

        public EstadoController(IConfiguration configuracion, IMapper mapper)
        {
            this._configuration = configuracion;
            this.mapper = mapper;
            this.cnBD = this._configuration.GetConnectionString("cn_bd_globalfrio");
        }

        [HttpGet]
        [Route("bd")]
        public ActionResult<DTO.EstadoBdDTO> getEstadoBd()
        {
            objBss = new Service.EstadoSER(this.cnBD, this.mapper);
            return Ok(objBss.obtener());
        }
    }
}
