package pe.upn.globalfrio;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import pe.upn.globalfrio.dto.CotizacionRequestDto;
import pe.upn.globalfrio.dto.CotizacionResponseDto;
import pe.upn.globalfrio.dto.ItemCotizacionDto;
import pe.upn.globalfrio.dto.RecomendacionEquipoDto;
import pe.upn.globalfrio.dto.ZonaDto;
import pe.upn.globalfrio.exception.BadRequestException;
import pe.upn.globalfrio.repository.ProductoRepository;
import pe.upn.globalfrio.service.CotizadorService;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Pruebas del cotizador sobre la base H2 del perfil dev (mismos datos que SQL Server).
 */
@SpringBootTest
@ActiveProfiles("dev")
class CotizadorServiceTest {

    @Autowired
    private CotizadorService cotizadorService;

    @Autowired
    private ProductoRepository productoRepository;

    private Long idProducto(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre).get(0).getId();
    }

    private Long idZona(String nombre) {
        return cotizadorService.obtenerCatalogo().zonas().stream()
                .filter(z -> z.nombre().equals(nombre)).map(ZonaDto::id).findFirst().orElseThrow();
    }

    @Test
    @DisplayName("RF01: el catálogo trae 3 tipos de servicio, 3 tipos de cliente, 6 zonas y 3 equipos")
    void catalogo() {
        var catalogo = cotizadorService.obtenerCatalogo();
        assertEquals(3, catalogo.tiposServicio().size());
        assertEquals(3, catalogo.tiposCliente().size());
        assertEquals(6, catalogo.zonas().size());
        assertEquals(3, catalogo.equipos().size());
    }

    @Test
    @DisplayName("RF02: para 25 m² recomienda 18 000 BTU y para 50 m² no hay un solo equipo")
    void recomendacion() {
        RecomendacionEquipoDto r25 = cotizadorService.recomendarEquipo(new BigDecimal("25"));
        assertEquals(18000, r25.equipo().capacidadBtu());

        RecomendacionEquipoDto r50 = cotizadorService.recomendarEquipo(new BigDecimal("50"));
        assertNull(r50.equipo());
    }

    @Test
    @DisplayName("RF03: casa en Lima Norte con equipo 12 000 BTU + instalación = S/ 1 630")
    void calcularInstalacionHogar() {
        CotizacionRequestDto request = new CotizacionRequestDto("INSTALACION", "HOGAR", idZona("Lima Norte"),
                new BigDecimal("18"), List.of(
                new ItemCotizacionDto(idProducto("Gree Inverter 12 000"), 1),
                new ItemCotizacionDto(idProducto("Instalación básica 12 000"), 1)));

        CotizacionResponseDto r = cotizadorService.calcular(request);
        assertEquals(0, new BigDecimal("1250.00").compareTo(r.subtotalEquipos()));
        assertEquals(0, new BigDecimal("350.00").compareTo(r.subtotalManoObra()));
        assertEquals(0, new BigDecimal("30.00").compareTo(r.costoTraslado()));
        assertEquals(0, new BigDecimal("1630.00").compareTo(r.total()));
        assertEquals(12000, r.btuRecomendado());
        assertNull(r.codigo());
    }

    @Test
    @DisplayName("RF03: el factor del tipo de cliente se aplica a la mano de obra (negocio × 1.15)")
    void calcularMantenimientoNegocio() {
        CotizacionRequestDto request = new CotizacionRequestDto("MANTENIMIENTO", "NEGOCIO", idZona("Lima Moderna"),
                null, List.of(new ItemCotizacionDto(idProducto("Mantenimiento preventivo 18 000"), 1)));

        CotizacionResponseDto r = cotizadorService.calcular(request);
        assertEquals(0, new BigDecimal("172.50").compareTo(r.subtotalManoObra()));   // 150 × 1.15
        assertEquals(0, new BigDecimal("222.50").compareTo(r.total()));              // + 50 de traslado
    }

    @Test
    @DisplayName("RF04: guardar genera un código y se puede consultar después")
    void guardarYConsultar() {
        CotizacionRequestDto request = new CotizacionRequestDto("REPARACION", "EMPRESA", idZona("Lima Centro"),
                null, List.of(new ItemCotizacionDto(idProducto("Diagnóstico técnico"), 1)));

        CotizacionResponseDto guardada = cotizadorService.guardar(request);
        assertNotNull(guardada.codigo());
        assertTrue(guardada.codigo().startsWith("COT-"));

        CotizacionResponseDto consultada = cotizadorService.obtenerPorCodigo(guardada.codigo());
        assertEquals(guardada.total(), consultada.total());
        assertEquals(1, consultada.lineas().size());
    }

    @Test
    @DisplayName("No se puede mezclar un servicio de otro tipo")
    void servicioDeOtroTipo() {
        CotizacionRequestDto request = new CotizacionRequestDto("MANTENIMIENTO", "HOGAR", idZona("Lima Norte"),
                null, List.of(new ItemCotizacionDto(idProducto("Instalación básica 12 000"), 1)));
        assertThrows(BadRequestException.class, () -> cotizadorService.calcular(request));
    }
}
