package pe.upn.globalfrio.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.upn.globalfrio.dto.CatalogoCotizadorDto;
import pe.upn.globalfrio.dto.CotizacionRequestDto;
import pe.upn.globalfrio.dto.CotizacionResponseDto;
import pe.upn.globalfrio.dto.ItemCotizacionDto;
import pe.upn.globalfrio.dto.LineaCotizacionDto;
import pe.upn.globalfrio.dto.OpcionCotizadorDto;
import pe.upn.globalfrio.dto.ProductoCotizadorDto;
import pe.upn.globalfrio.dto.RecomendacionEquipoDto;
import pe.upn.globalfrio.dto.ZonaDto;
import pe.upn.globalfrio.entity.Cotizacion;
import pe.upn.globalfrio.entity.DetalleCotizacion;
import pe.upn.globalfrio.entity.Producto;
import pe.upn.globalfrio.entity.TipoCliente;
import pe.upn.globalfrio.entity.TipoServicio;
import pe.upn.globalfrio.entity.Zona;
import pe.upn.globalfrio.exception.BadRequestException;
import pe.upn.globalfrio.exception.ResourceNotFoundException;
import pe.upn.globalfrio.repository.CotizacionRepository;
import pe.upn.globalfrio.repository.ProductoRepository;
import pe.upn.globalfrio.repository.TipoClienteRepository;
import pe.upn.globalfrio.repository.TipoServicioRepository;
import pe.upn.globalfrio.repository.ZonaRepository;
import pe.upn.globalfrio.service.CotizadorService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

/**
 * Implementación del cotizador.
 * Precio estimado (RF03) = equipos + mano de obra (precio base del servicio × factor del tipo de cliente) + traslado de la zona.
 */
@Service
@Transactional(readOnly = true)
public class CotizadorServiceImpl implements CotizadorService {

    private static final String EQUIPO = "EQUIPO";
    private static final String SERVICIO = "SERVICIO";
    private static final String INSTALACION = "INSTALACION";

    private final TipoServicioRepository tipoServicioRepository;
    private final TipoClienteRepository tipoClienteRepository;
    private final ZonaRepository zonaRepository;
    private final ProductoRepository productoRepository;
    private final CotizacionRepository cotizacionRepository;

    public CotizadorServiceImpl(TipoServicioRepository tipoServicioRepository,
                                TipoClienteRepository tipoClienteRepository,
                                ZonaRepository zonaRepository,
                                ProductoRepository productoRepository,
                                CotizacionRepository cotizacionRepository) {
        this.tipoServicioRepository = tipoServicioRepository;
        this.tipoClienteRepository = tipoClienteRepository;
        this.zonaRepository = zonaRepository;
        this.productoRepository = productoRepository;
        this.cotizacionRepository = cotizacionRepository;
    }

    @Override
    public CatalogoCotizadorDto obtenerCatalogo() {
        List<OpcionCotizadorDto> tiposServicio = tipoServicioRepository.findByActivoTrueOrderByIdAsc().stream()
                .map(t -> new OpcionCotizadorDto(t.getCodigo(), t.getNombre(), t.getDescripcion(), null))
                .toList();
        List<OpcionCotizadorDto> tiposCliente = tipoClienteRepository.findByActivoTrueOrderByIdAsc().stream()
                .map(t -> new OpcionCotizadorDto(t.getCodigo(), t.getNombre(), t.getDescripcion(), t.getFactorPrecio()))
                .toList();
        List<ZonaDto> zonas = zonaRepository.findByActivoTrueOrderByCostoTrasladoAsc().stream()
                .map(z -> new ZonaDto(z.getId(), z.getNombre(), z.getDistritos(), z.getCostoTraslado()))
                .toList();
        List<ProductoCotizadorDto> equipos = productoRepository.buscarEquiposActivos().stream()
                .map(this::aDto)
                .toList();
        return new CatalogoCotizadorDto(tiposServicio, tiposCliente, zonas, equipos);
    }

    @Override
    public RecomendacionEquipoDto recomendarEquipo(BigDecimal areaM2) {
        if (areaM2 == null || areaM2.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("El área del ambiente debe ser mayor a 0 m²");
        }
        Integer areaEntera = areaM2.setScale(0, RoundingMode.CEILING).intValue();
        List<Producto> equipos = productoRepository.buscarEquiposParaArea(areaEntera);
        if (equipos.isEmpty()) {
            return new RecomendacionEquipoDto(areaM2, null,
                    "Para ambientes de más de 40 m² se recomienda más de un equipo o una visita técnica. Escríbenos por WhatsApp.");
        }
        Producto recomendado = equipos.get(0);
        return new RecomendacionEquipoDto(areaM2, aDto(recomendado),
                "Para " + areaM2.stripTrailingZeros().toPlainString() + " m² te recomendamos un equipo de "
                        + recomendado.getCapacidadBtu() + " BTU/h.");
    }

    @Override
    public List<ProductoCotizadorDto> listarServicios(String tipoServicio, Integer capacidadBtu) {
        buscarTipoServicio(tipoServicio);
        return productoRepository.buscarServicios(tipoServicio, capacidadBtu).stream()
                .map(this::aDto)
                .toList();
    }

    @Override
    public CotizacionResponseDto calcular(CotizacionRequestDto request) {
        return aDto(armarCotizacion(request));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public CotizacionResponseDto guardar(CotizacionRequestDto request) {
        Cotizacion cotizacion = armarCotizacion(request);
        Long siguiente = cotizacionRepository.obtenerUltimoId() + 1;
        cotizacion.setCodigo(String.format("COT-%d-%06d", LocalDate.now().getYear(), siguiente));
        return aDto(cotizacionRepository.save(cotizacion));
    }

    @Override
    public CotizacionResponseDto obtenerPorCodigo(String codigo) {
        Cotizacion cotizacion = cotizacionRepository.buscarPorCodigoConDetalle(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la cotización " + codigo));
        return aDto(cotizacion);
    }

    // ------------------------------------------------------------------ cálculo

    private Cotizacion armarCotizacion(CotizacionRequestDto request) {
        TipoServicio tipoServicio = buscarTipoServicio(request.tipoServicio());
        TipoCliente tipoCliente = tipoClienteRepository.findByCodigoAndActivoTrue(request.tipoCliente())
                .orElseThrow(() -> new BadRequestException("Tipo de lugar no válido: " + request.tipoCliente()));
        Zona zona = zonaRepository.findById(request.zonaId())
                .filter(Zona::getActivo)
                .orElseThrow(() -> new BadRequestException("Zona no válida"));

        Cotizacion cotizacion = new Cotizacion();
        cotizacion.setTipoServicio(tipoServicio);
        cotizacion.setTipoCliente(tipoCliente);
        cotizacion.setZona(zona);
        cotizacion.setAreaM2(request.areaM2());
        if (request.areaM2() != null) {
            RecomendacionEquipoDto recomendacion = recomendarEquipo(request.areaM2());
            if (recomendacion.equipo() != null) {
                cotizacion.setBtuRecomendado(recomendacion.equipo().capacidadBtu());
            }
        }

        BigDecimal subtotalEquipos = BigDecimal.ZERO;
        BigDecimal subtotalManoObra = BigDecimal.ZERO;

        for (ItemCotizacionDto item : request.items()) {
            Producto producto = productoRepository.findById(item.productoId())
                    .filter(Producto::getActivo)
                    .orElseThrow(() -> new BadRequestException("El producto " + item.productoId() + " no está disponible"));

            BigDecimal precioUnitario;
            if (EQUIPO.equals(producto.getCategoria())) {
                if (!INSTALACION.equals(tipoServicio.getCodigo())) {
                    throw new BadRequestException("Los equipos se cotizan junto con el servicio de instalación");
                }
                precioUnitario = producto.getPrecio();
            } else if (SERVICIO.equals(producto.getCategoria())) {
                if (producto.getTipoServicio() == null
                        || !tipoServicio.getCodigo().equals(producto.getTipoServicio().getCodigo())) {
                    throw new BadRequestException("El servicio \"" + producto.getNombre()
                            + "\" no corresponde a " + tipoServicio.getNombre());
                }
                precioUnitario = producto.getPrecio().multiply(tipoCliente.getFactorPrecio())
                        .setScale(2, RoundingMode.HALF_UP);
            } else {
                throw new BadRequestException("Categoría de producto no válida");
            }

            BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(item.cantidad()));
            DetalleCotizacion detalle = new DetalleCotizacion();
            detalle.setProducto(producto);
            detalle.setCantidad(item.cantidad());
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubtotal(subtotal);
            cotizacion.agregarDetalle(detalle);

            if (EQUIPO.equals(producto.getCategoria())) {
                subtotalEquipos = subtotalEquipos.add(subtotal);
            } else {
                subtotalManoObra = subtotalManoObra.add(subtotal);
            }
        }

        cotizacion.setSubtotalEquipos(subtotalEquipos);
        cotizacion.setSubtotalManoObra(subtotalManoObra);
        cotizacion.setCostoTraslado(zona.getCostoTraslado());
        cotizacion.setTotal(subtotalEquipos.add(subtotalManoObra).add(zona.getCostoTraslado()));
        return cotizacion;
    }

    private TipoServicio buscarTipoServicio(String codigo) {
        return tipoServicioRepository.findByCodigoAndActivoTrue(codigo)
                .orElseThrow(() -> new BadRequestException("Tipo de servicio no válido: " + codigo));
    }

    // ------------------------------------------------------------------ conversión a DTO

    private ProductoCotizadorDto aDto(Producto p) {
        return new ProductoCotizadorDto(p.getId(), p.getNombre(), p.getDescripcion(), p.getPrecio(),
                p.getCategoria(), p.getCapacidadBtu(), p.getAreaMaxM2(),
                p.getTipoServicio() != null ? p.getTipoServicio().getCodigo() : null);
    }

    private CotizacionResponseDto aDto(Cotizacion c) {
        List<LineaCotizacionDto> lineas = c.getDetalles().stream()
                .map(d -> new LineaCotizacionDto(d.getProducto().getId(), d.getProducto().getNombre(),
                        d.getProducto().getCategoria(), d.getCantidad(), d.getPrecioUnitario(), d.getSubtotal()))
                .toList();
        return new CotizacionResponseDto(c.getCodigo(), c.getFecha(), c.getTipoServicio().getNombre(),
                c.getTipoCliente().getNombre(), c.getTipoCliente().getFactorPrecio(), c.getZona().getNombre(),
                c.getAreaM2(), c.getBtuRecomendado(), lineas, c.getSubtotalEquipos(), c.getSubtotalManoObra(),
                c.getCostoTraslado(), c.getTotal());
    }
}
