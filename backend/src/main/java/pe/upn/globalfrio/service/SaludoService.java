package pe.upn.globalfrio.service;

import pe.upn.globalfrio.dto.SaludoResponseDto;

/**
 * Interfaz de servicio para operaciones de verificación y saludo del backend.
 * Demuestra el patrón Service y la separación de responsabilidades N-Capas (RF-SEM01-01, SPEC-SEM02-B).
 */
public interface SaludoService {

    /**
     * Retorna el mensaje simple canónico exigido por RF-SEM01-01 ("Backend activo").
     * @return Mensaje de texto "Backend activo"
     */
    String obtenerMensajeSaludo();

    /**
     * Retorna información estructurada de diagnóstico y estado del servicio.
     * @return DTO con metadatos del sistema
     */
    SaludoResponseDto obtenerDetalleSaludo();
}
