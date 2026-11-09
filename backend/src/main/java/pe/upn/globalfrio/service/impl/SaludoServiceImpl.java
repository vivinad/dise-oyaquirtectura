package pe.upn.globalfrio.service.impl;

import org.springframework.stereotype.Service;
import pe.upn.globalfrio.dto.SaludoResponseDto;
import pe.upn.globalfrio.service.SaludoService;

import java.time.LocalDateTime;

/**
 * Implementación del servicio de saludo para Global Frío.
 * Alineado al patrón Singleton y gestión de componentes de Spring Boot.
 */
@Service
public class SaludoServiceImpl implements SaludoService {

    @Override
    public String obtenerMensajeSaludo() {
        return "Backend activo";
    }

    @Override
    public SaludoResponseDto obtenerDetalleSaludo() {
        return SaludoResponseDto.builder()
                .mensaje("Backend activo y en ejecución")
                .estado("UP")
                .version("1.0.0-SNAPSHOT")
                .curso("Diseño y Arquitectura de Software - UPN")
                .timestamp(LocalDateTime.now())
                .build();
    }
}
