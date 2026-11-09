package pe.upn.globalfrio.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Equipo o servicio elegido por el cliente.
 */
public record ItemCotizacionDto(
        @NotNull(message = "El producto es obligatorio") Long productoId,
        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad mínima es 1")
        @Max(value = 20, message = "La cantidad máxima es 20") Integer cantidad) {
}
