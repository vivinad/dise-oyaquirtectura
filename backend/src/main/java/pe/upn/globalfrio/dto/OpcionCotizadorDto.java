package pe.upn.globalfrio.dto;

import java.math.BigDecimal;

/**
 * Opción de los pasos 1 y 2 del cotizador (tipo de servicio o tipo de cliente).
 * factorPrecio solo aplica al tipo de cliente.
 */
public record OpcionCotizadorDto(String codigo, String nombre, String descripcion, BigDecimal factorPrecio) {
}
