package pe.upn.globalfrio.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

/**
 * Datos que envía la página para calcular (RF03) o guardar (RF04) una cotización.
 * No incluye datos personales: el cotizador es libre y el contacto se hace por WhatsApp.
 */
public record CotizacionRequestDto(
        @NotBlank(message = "Elige el tipo de servicio") String tipoServicio,
        @NotBlank(message = "Elige el tipo de lugar") String tipoCliente,
        @NotNull(message = "Elige la zona") Long zonaId,
        @DecimalMin(value = "1", message = "El área debe ser mayor a 0")
        @DecimalMax(value = "1000", message = "El área máxima es 1000 m²") BigDecimal areaM2,
        @NotEmpty(message = "Elige al menos un equipo o servicio") List<@Valid ItemCotizacionDto> items) {
}
