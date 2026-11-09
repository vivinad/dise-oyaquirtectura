package pe.upn.globalfrio.dto;

import java.math.BigDecimal;

/**
 * RF02: equipo sugerido para el tamaño del ambiente. equipo es null si el área supera
 * la capacidad del catálogo; en ese caso mensaje explica qué hacer.
 */
public record RecomendacionEquipoDto(BigDecimal areaM2, ProductoCotizadorDto equipo, String mensaje) {
}
