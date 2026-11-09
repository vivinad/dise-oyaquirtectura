package pe.upn.globalfrio.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Resultado de la cotización: detalle y precio estimado (RF03).
 * codigo y fecha solo vienen cuando la cotización fue guardada (RF04).
 */
public record CotizacionResponseDto(
        String codigo,
        LocalDateTime fecha,
        String tipoServicio,
        String tipoCliente,
        BigDecimal factorPrecio,
        String zona,
        BigDecimal areaM2,
        Integer btuRecomendado,
        List<LineaCotizacionDto> lineas,
        BigDecimal subtotalEquipos,
        BigDecimal subtotalManoObra,
        BigDecimal costoTraslado,
        BigDecimal total) {
}
