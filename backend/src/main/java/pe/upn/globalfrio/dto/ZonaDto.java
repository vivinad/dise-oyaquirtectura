package pe.upn.globalfrio.dto;

import java.math.BigDecimal;

public record ZonaDto(Long id, String nombre, String distritos, BigDecimal costoTraslado) {
}
