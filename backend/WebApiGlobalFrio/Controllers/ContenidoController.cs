using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace WebApiGlobalFrio.Controllers
{
    /// <summary>
    /// Contenido de la página de inicio: secciones Servicios, Trabajos y Mantenimiento.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ContenidoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string cnBD = "";
        private Service.ContenidoSER objBss;
        private readonly IMapper mapper;

        public ContenidoController(IConfiguration configuracion, IMapper mapper)
        {
            this._configuration = configuracion;
            this.mapper = mapper;
            this.cnBD = this._configuration.GetConnectionString("cn_bd_globalfrio");
        }

        /// <summary>Tarjetas de la sección Servicios (tabla servicio_web).</summary>
        [HttpGet]
        [Route("servicios")]
        public ActionResult<List<DTO.ServicioWebDTO>> getServicios()
        {
            objBss = new Service.ContenidoSER(this.cnBD, this.mapper);
            return Ok(objBss.listarServicios());
        }

        /// <summary>Fotos de la galería de Trabajos (tabla trabajo).</summary>
        [HttpGet]
        [Route("trabajos")]
        public ActionResult<List<DTO.TrabajoDTO>> getTrabajos()
        {
            objBss = new Service.ContenidoSER(this.cnBD, this.mapper);
            return Ok(objBss.listarTrabajos());
        }

        /// <summary>Lo que incluye el mantenimiento (tabla item_mantenimiento).</summary>
        [HttpGet]
        [Route("mantenimiento")]
        public ActionResult<List<DTO.ItemMantenimientoDTO>> getMantenimiento()
        {
            objBss = new Service.ContenidoSER(this.cnBD, this.mapper);
            return Ok(objBss.listarItemsMantenimiento());
        }
    }
}
