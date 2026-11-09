package pe.upn.globalfrio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para la respuesta estructurada del endpoint de verificación de salud / saludo.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaludoResponseDto {
    private String mensaje;
    private String estado;
    private String version;
    private String curso;
    private LocalDateTime timestamp;
}
