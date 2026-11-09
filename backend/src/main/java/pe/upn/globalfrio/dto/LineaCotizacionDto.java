package pe.upn.globalfrio.dto;

import java.math.BigDecimal;

public record LineaCotizacionDto(
        Long productoId,
        String nombre,
        String categoria,
        Integer cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal) {
}
