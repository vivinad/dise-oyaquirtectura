package pe.upn.globalfrio.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pe.upn.globalfrio.dto.SaludoResponseDto;
import pe.upn.globalfrio.exception.BadRequestException;
import pe.upn.globalfrio.exception.ResourceNotFoundException;
import pe.upn.globalfrio.service.SaludoService;

/**
 * Controlador REST inicial para verificación y saludo de la API.
 * Cumple estrictamente con el requerimiento RF-SEM01-01 y SPEC-SEM01-A.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(originPatterns = "*")
@Tag(name = "Saludo & Diagnóstico", description = "Endpoints para verificación de estado y conectividad del backend")
public class SaludoController {

    private final SaludoService saludoService;

    public SaludoController(SaludoService saludoService) {
        this.saludoService = saludoService;
    }

    @Operation(summary = "Verificar estado del backend (RF-SEM01-01)",
               description = "Retorna el mensaje estándar 'Backend activo' para comprobar conectividad.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Backend activo y respondiendo correctamente")
    })
    @GetMapping("/saludo")
    public ResponseEntity<String> saludo() {
        return ResponseEntity.ok(saludoService.obtenerMensajeSaludo());
    }

    @Operation(summary = "Obtener detalles técnicos del backend",
               description = "Retorna información estructurada sobre el estado del sistema, versión y contexto académico.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Detalles técnicos del backend obtenidos exitosamente")
    })
    @GetMapping("/saludo/detalle")
    public ResponseEntity<SaludoResponseDto> saludoDetalle() {
        return ResponseEntity.ok(saludoService.obtenerDetalleSaludo());
    }

    @Operation(summary = "Endpoint de prueba para manejo global de excepciones",
               description = "Permite simular errores (bad-request, not-found) para validar la respuesta estandarizada de GlobalExceptionHandler.")
    @GetMapping("/saludo/test-error")
    public ResponseEntity<Void> testError(@RequestParam(name = "tipo", defaultValue = "bad-request") String tipo) {
        if ("not-found".equalsIgnoreCase(tipo)) {
            throw new ResourceNotFoundException("Recurso de prueba no encontrado");
        } else if ("bad-request".equalsIgnoreCase(tipo)) {
            throw new BadRequestException("Parámetro inválido recibido en la prueba");
        }
        throw new RuntimeException("Error inesperado provocado para prueba de GlobalExceptionHandler");
    }
}
