using AutoMapper;
using DTO;
using Entity;

namespace WebApiGlobalFrio
{
    /// <summary>
    /// Conversión de las clases BE (tablas) a los DTO que recibe el frontend.
    /// </summary>
    public class AutomapperHelper : Profile
    {
        public AutomapperHelper()
        {
            // Contenido de la página de inicio
            CreateMap<ServicioWebBE, ServicioWebDTO>()
                .ForMember(d => d.texto, o => o.MapFrom(s => s.descripcion));
            CreateMap<TrabajoBE, TrabajoDTO>()
                .ForMember(d => d.alt, o => o.MapFrom(s => s.textoAlternativo));
            CreateMap<ItemMantenimientoBE, ItemMantenimientoDTO>()
                .ForMember(d => d.texto, o => o.MapFrom(s => s.descripcion));

            // Cotizador
            CreateMap<TipoServicioBE, OpcionCotizadorDTO>()
                .ForMember(d => d.factorPrecio, o => o.Ignore());
            CreateMap<TipoClienteBE, OpcionCotizadorDTO>();
            CreateMap<ZonaBE, ZonaDTO>();
            CreateMap<ProductoBE, ProductoCotizadorDTO>();
            CreateMap<DetalleCotizacionBE, LineaCotizacionDTO>();
            CreateMap<CotizacionBE, CotizacionResponseDTO>()
                .ForMember(d => d.lineas, o => o.MapFrom(s => s.detalles));

            // Estado de la conexión
            CreateMap<EstadoBdBE, EstadoBdDTO>()
                .ForMember(d => d.conectado, o => o.Ignore());
        }
    }
}
