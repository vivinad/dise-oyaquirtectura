using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace WebApiGlobalFrio.Controllers
{
    /// <summary>
    /// API pública del cotizador web (no requiere login).
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CotizadorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string cnBD = "";
        private Service.CotizadorSER objBss;
        private readonly IMapper mapper;

        public CotizadorController(IConfiguration configuracion, IMapper mapper)
        {
            this._configuration = configuracion;
            this.mapper = mapper;
            this.cnBD = this._configuration.GetConnectionString("cn_bd_globalfrio");
        }

        /// <summary>RF01: tipos de servicio, tipos de cliente, zonas y equipos.</summary>
        [HttpGet]
        [Route("catalogo")]
        public ActionResult<DTO.CatalogoCotizadorDTO> getCatalogo()
        {
            objBss = new Service.CotizadorSER(this.cnBD, this.mapper);
            return Ok(objBss.obtenerCatalogo());
        }

        /// <summary>RF02: equipo recomendado según el área del ambiente en m².</summary>
        [HttpGet]
        [Route("recomendacion")]
        public ActionResult<DTO.RecomendacionEquipoDTO> getRecomendacion(decimal area)
        {
            objBss = new Service.CotizadorSER(this.cnBD, this.mapper);
            return Ok(objBss.recomendarEquipo(area));
        }

        /// <summary>Servicios de un tipo (INSTALACION, MANTENIMIENTO o REPARACION) para una capacidad de equipo.</summary>
        [HttpGet]
        [Route("servicios")]
        public ActionResult<List<DTO.ProductoCotizadorDTO>> getServicios(string tipo, int? btu)
        {
            objBss = new Service.CotizadorSER(this.cnBD, this.mapper);
            return Ok(objBss.listarServicios(tipo, btu));
        }

        /// <summary>RF03: calcula el precio estimado sin guardar.</summary>
        [HttpPost]
        [Route("calcular")]
        public ActionResult<DTO.CotizacionResponseDTO> calcular([FromBody] DTO.CotizacionRequestDTO request)
        {
            objBss = new Service.CotizadorSER(this.cnBD, this.mapper);
            return Ok(objBss.calcular(request));
        }

        /// <summary>RF04: calcula y guarda la cotización. Devuelve su código para el PDF y WhatsApp.</summary>
        [HttpPost]
        [Route("cotizaciones")]
        public ActionResult<DTO.CotizacionResponseDTO> guardar([FromBody] DTO.CotizacionRequestDTO request)
        {
            objBss = new Service.CotizadorSER(this.cnBD, this.mapper);
            return StatusCode(StatusCodes.Status201Created, objBss.guardar(request));
        }

        /// <summary>RF05: consulta una cotización guardada por su código.</summary>
        [HttpGet]
        [Route("cotizaciones/{codigo}")]
        public ActionResult<DTO.CotizacionResponseDTO> getCotizacion(string codigo)
        {
            objBss = new Service.CotizadorSER(this.cnBD, this.mapper);
            return Ok(objBss.obtenerPorCodigo(codigo));
        }
    }
}
