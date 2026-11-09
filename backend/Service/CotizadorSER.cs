using AutoMapper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace Service
{
    /// <summary>
    /// Lógica del cotizador: catálogo (RF01), recomendación de equipo (RF02), precio estimado (RF03),
    /// registro (RF04) y consulta (RF05) de cotizaciones.
    /// Total = equipos + (precio base del servicio × factor del tipo de cliente) + traslado de la zona.
    /// </summary>
    public class CotizadorSER
    {
        private const string EQUIPO = "EQUIPO";
        private const string SERVICIO = "SERVICIO";
        private const string INSTALACION = "INSTALACION";

        private Data.CotizadorDA objData;
        private Data.CotizacionDA objCotizacion;
        private readonly string cnBD = "";
        private readonly IMapper mapper;

        public CotizadorSER(string cnBD, IMapper mapper)
        {
            this.cnBD = cnBD;
            this.mapper = mapper;
        }

        // ------------------------------------------------------------------ RF01

        public DTO.CatalogoCotizadorDTO obtenerCatalogo()
        {
            objData = new Data.CotizadorDA(this.cnBD);

            var tiposServicio = mapper.Map<List<DTO.OpcionCotizadorDTO>>(objData.listarTiposServicio());
            var tiposCliente = mapper.Map<List<DTO.OpcionCotizadorDTO>>(objData.listarTiposCliente());

            return new DTO.CatalogoCotizadorDTO
            {
                tiposServicio = tiposServicio,
                tiposCliente = tiposCliente,
                zonas = mapper.Map<List<DTO.ZonaDTO>>(objData.listarZonas()),
                equipos = mapper.Map<List<DTO.ProductoCotizadorDTO>>(objData.listarEquipos())
            };
        }

        // ------------------------------------------------------------------ RF02

        public DTO.RecomendacionEquipoDTO recomendarEquipo(decimal areaM2)
        {
            if (areaM2 <= 0)
            {
                throw new NegocioException("El área del ambiente debe ser mayor a 0 m²");
            }

            objData = new Data.CotizadorDA(this.cnBD);
            int areaEntera = (int)Math.Ceiling(areaM2);
            List<Entity.ProductoBE> equipos = objData.listarEquiposParaArea(areaEntera);

            if (equipos.Count == 0)
            {
                return new DTO.RecomendacionEquipoDTO
                {
                    areaM2 = areaM2,
                    equipo = null,
                    mensaje = "Para ambientes de más de 40 m² se recomienda más de un equipo o una visita técnica. Escríbenos por WhatsApp."
                };
            }

            Entity.ProductoBE recomendado = equipos[0];
            return new DTO.RecomendacionEquipoDTO
            {
                areaM2 = areaM2,
                equipo = mapper.Map<DTO.ProductoCotizadorDTO>(recomendado),
                mensaje = "Para " + areaM2.ToString("0.##", CultureInfo.InvariantCulture) + " m² te recomendamos un equipo de "
                          + recomendado.capacidadBtu + " BTU/h."
            };
        }

        public List<DTO.ProductoCotizadorDTO> listarServicios(string tipoServicio, int? capacidadBtu)
        {
            buscarTipoServicio(tipoServicio);
            objData = new Data.CotizadorDA(this.cnBD);
            return mapper.Map<List<DTO.ProductoCotizadorDTO>>(objData.listarServicios(tipoServicio, capacidadBtu));
        }

        // ------------------------------------------------------------------ RF03, RF04 y RF05

        public DTO.CotizacionResponseDTO calcular(DTO.CotizacionRequestDTO request)
        {
            return mapper.Map<DTO.CotizacionResponseDTO>(armarCotizacion(request));
        }

        public DTO.CotizacionResponseDTO guardar(DTO.CotizacionRequestDTO request)
        {
            Entity.CotizacionBE cotizacion = armarCotizacion(request);
            objCotizacion = new Data.CotizacionDA(this.cnBD);
            return mapper.Map<DTO.CotizacionResponseDTO>(objCotizacion.registrar(cotizacion));
        }

        public DTO.CotizacionResponseDTO obtenerPorCodigo(string codigo)
        {
            objCotizacion = new Data.CotizacionDA(this.cnBD);
            Entity.CotizacionBE cotizacion = objCotizacion.obtenerPorCodigo(codigo);
            if (cotizacion == null)
            {
                throw new NegocioException("No existe la cotización " + codigo, noEncontrado: true);
            }
            return mapper.Map<DTO.CotizacionResponseDTO>(cotizacion);
        }

        // ------------------------------------------------------------------ cálculo

        private Entity.CotizacionBE armarCotizacion(DTO.CotizacionRequestDTO request)
        {
            validar(request);
            objData = new Data.CotizadorDA(this.cnBD);

            Entity.TipoServicioBE tipoServicio = buscarTipoServicio(request.tipoServicio);
            Entity.TipoClienteBE tipoCliente = objData.obtenerTipoCliente(request.tipoCliente)
                ?? throw new NegocioException("Tipo de lugar no válido: " + request.tipoCliente);
            Entity.ZonaBE zona = objData.obtenerZona(request.zonaId)
                ?? throw new NegocioException("Zona no válida");

            var cotizacion = new Entity.CotizacionBE
            {
                tipoServicioId = tipoServicio.id,
                tipoServicio = tipoServicio.nombre,
                tipoClienteId = tipoCliente.id,
                tipoCliente = tipoCliente.nombre,
                factorPrecio = tipoCliente.factorPrecio,
                zonaId = zona.id,
                zona = zona.nombre,
                areaM2 = request.areaM2
            };

            if (request.areaM2.HasValue)
            {
                DTO.RecomendacionEquipoDTO recomendacion = recomendarEquipo(request.areaM2.Value);
                cotizacion.btuRecomendado = recomendacion.equipo?.capacidadBtu;
            }

            decimal subtotalEquipos = 0m;
            decimal subtotalManoObra = 0m;

            foreach (DTO.ItemCotizacionDTO item in request.items)
            {
                Entity.ProductoBE producto = objData.obtenerProducto(item.productoId)
                    ?? throw new NegocioException("El producto " + item.productoId + " no está disponible");

                decimal precioUnitario;
                if (producto.categoria == EQUIPO)
                {
                    if (tipoServicio.codigo != INSTALACION)
                    {
                        throw new NegocioException("Los equipos se cotizan junto con el servicio de instalación");
                    }
                    precioUnitario = producto.precio;
                }
                else if (producto.categoria == SERVICIO)
                {
                    if (producto.tipoServicio != tipoServicio.codigo)
                    {
                        throw new NegocioException("El servicio \"" + producto.nombre + "\" no corresponde a " + tipoServicio.nombre);
                    }
                    precioUnitario = Math.Round(producto.precio * tipoCliente.factorPrecio, 2, MidpointRounding.AwayFromZero);
                }
                else
                {
                    throw new NegocioException("Categoría de producto no válida");
                }

                decimal subtotal = precioUnitario * item.cantidad;
                cotizacion.detalles.Add(new Entity.DetalleCotizacionBE
                {
                    productoId = producto.id,
                    nombre = producto.nombre,
                    categoria = producto.categoria,
                    cantidad = item.cantidad,
                    precioUnitario = precioUnitario,
                    subtotal = subtotal
                });

                if (producto.categoria == EQUIPO)
                {
                    subtotalEquipos += subtotal;
                }
                else
                {
                    subtotalManoObra += subtotal;
                }
            }

            cotizacion.subtotalEquipos = subtotalEquipos;
            cotizacion.subtotalManoObra = subtotalManoObra;
            cotizacion.costoTraslado = zona.costoTraslado;
            cotizacion.total = subtotalEquipos + subtotalManoObra + zona.costoTraslado;
            return cotizacion;
        }

        private static void validar(DTO.CotizacionRequestDTO request)
        {
            if (request == null)
            {
                throw new NegocioException("No se recibieron los datos de la cotización");
            }
            if (string.IsNullOrWhiteSpace(request.tipoServicio))
            {
                throw new NegocioException("Elige el tipo de servicio");
            }
            if (string.IsNullOrWhiteSpace(request.tipoCliente))
            {
                throw new NegocioException("Elige el tipo de lugar");
            }
            if (request.zonaId <= 0)
            {
                throw new NegocioException("Elige la zona");
            }
            if (request.areaM2.HasValue && (request.areaM2 < 1 || request.areaM2 > 1000))
            {
                throw new NegocioException("El área debe estar entre 1 y 1000 m²");
            }
            if (request.items == null || request.items.Count == 0)
            {
                throw new NegocioException("Elige al menos un equipo o servicio");
            }
            if (request.items.Any(i => i.cantidad < 1 || i.cantidad > 20))
            {
                throw new NegocioException("La cantidad de cada equipo o servicio debe estar entre 1 y 20");
            }
        }

        private Entity.TipoServicioBE buscarTipoServicio(string codigo)
        {
            objData = new Data.CotizadorDA(this.cnBD);
            return objData.obtenerTipoServicio(codigo)
                ?? throw new NegocioException("Tipo de servicio no válido: " + codigo);
        }
    }
}
