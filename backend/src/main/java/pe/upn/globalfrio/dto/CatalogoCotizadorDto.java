package pe.upn.globalfrio.dto;

import java.util.List;

/**
 * Datos iniciales que necesita la página para armar el cotizador.
 */
public record CatalogoCotizadorDto(
        List<OpcionCotizadorDto> tiposServicio,
        List<OpcionCotizadorDto> tiposCliente,
        List<ZonaDto> zonas,
        List<ProductoCotizadorDto> equipos) {
}
