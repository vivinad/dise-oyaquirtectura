package pe.upn.globalfrio.dto;

import java.math.BigDecimal;

/**
 * Equipo o servicio del catálogo tal como lo ve el cotizador (RF01).
 */
public record ProductoCotizadorDto(
        Long id,
        String nombre,
        String descripcion,
        BigDecimal precio,
        String categoria,
        Integer capacidadBtu,
        Integer areaMaxM2,
        String tipoServicio) {
}
