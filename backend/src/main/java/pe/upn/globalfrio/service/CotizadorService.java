package pe.upn.globalfrio.service;

import pe.upn.globalfrio.dto.CatalogoCotizadorDto;
import pe.upn.globalfrio.dto.CotizacionRequestDto;
import pe.upn.globalfrio.dto.CotizacionResponseDto;
import pe.upn.globalfrio.dto.ProductoCotizadorDto;
import pe.upn.globalfrio.dto.RecomendacionEquipoDto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Lógica de negocio del cotizador web de Global Frío.
 */
public interface CotizadorService {

    /** Tipos de servicio, tipos de cliente, zonas y equipos (RF01). */
    CatalogoCotizadorDto obtenerCatalogo();

    /** Equipo recomendado según el tamaño del ambiente (RF02). */
    RecomendacionEquipoDto recomendarEquipo(BigDecimal areaM2);

    /** Servicios disponibles para un tipo de servicio y una capacidad de equipo. */
    List<ProductoCotizadorDto> listarServicios(String tipoServicio, Integer capacidadBtu);

    /** Calcula el precio estimado sin guardar (RF03). */
    CotizacionResponseDto calcular(CotizacionRequestDto request);

    /** Calcula y guarda la cotización con un código correlativo (RF04). */
    CotizacionResponseDto guardar(CotizacionRequestDto request);

    /** Recupera una cotización guardada para mostrarla o descargarla (RF05). */
    CotizacionResponseDto obtenerPorCodigo(String codigo);
}
