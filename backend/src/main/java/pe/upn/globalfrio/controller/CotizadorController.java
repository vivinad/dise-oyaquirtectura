package pe.upn.globalfrio.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pe.upn.globalfrio.dto.CatalogoCotizadorDto;
import pe.upn.globalfrio.dto.CotizacionRequestDto;
import pe.upn.globalfrio.dto.CotizacionResponseDto;
import pe.upn.globalfrio.dto.ProductoCotizadorDto;
import pe.upn.globalfrio.dto.RecomendacionEquipoDto;
import pe.upn.globalfrio.service.CotizadorService;

import java.math.BigDecimal;
import java.util.List;

/**
 * API pública del cotizador web (no requiere login).
 */
@RestController
@RequestMapping("/api/cotizador")
@CrossOrigin(originPatterns = "*")
@Tag(name = "Cotizador", description = "Catálogo, recomendación de equipo, cálculo y registro de cotizaciones")
public class CotizadorController {

    private final CotizadorService cotizadorService;

    public CotizadorController(CotizadorService cotizadorService) {
        this.cotizadorService = cotizadorService;
    }

    @Operation(summary = "Catálogo del cotizador (RF01)",
               description = "Tipos de servicio, tipos de cliente, zonas de atención y equipos disponibles.")
    @GetMapping("/catalogo")
    public ResponseEntity<CatalogoCotizadorDto> catalogo() {
        return ResponseEntity.ok(cotizadorService.obtenerCatalogo());
    }

    @Operation(summary = "Equipo recomendado según el área (RF02)")
    @GetMapping("/recomendacion")
    public ResponseEntity<RecomendacionEquipoDto> recomendacion(@RequestParam("area") BigDecimal area) {
        return ResponseEntity.ok(cotizadorService.recomendarEquipo(area));
    }

    @Operation(summary = "Servicios de un tipo para una capacidad de equipo")
    @GetMapping("/servicios")
    public ResponseEntity<List<ProductoCotizadorDto>> servicios(
            @RequestParam("tipo") String tipo,
            @RequestParam(value = "btu", required = false) Integer btu) {
        return ResponseEntity.ok(cotizadorService.listarServicios(tipo, btu));
    }

    @Operation(summary = "Calcular precio estimado sin guardar (RF03)")
    @PostMapping("/calcular")
    public ResponseEntity<CotizacionResponseDto> calcular(@Valid @RequestBody CotizacionRequestDto request) {
        return ResponseEntity.ok(cotizadorService.calcular(request));
    }

    @Operation(summary = "Guardar la cotización (RF04)",
               description = "Calcula y registra la cotización. Devuelve su código para el documento y WhatsApp.")
    @PostMapping("/cotizaciones")
    public ResponseEntity<CotizacionResponseDto> guardar(@Valid @RequestBody CotizacionRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cotizadorService.guardar(request));
    }

    @Operation(summary = "Consultar una cotización guardada (RF05)")
    @GetMapping("/cotizaciones/{codigo}")
    public ResponseEntity<CotizacionResponseDto> obtener(@PathVariable("codigo") String codigo) {
        return ResponseEntity.ok(cotizadorService.obtenerPorCodigo(codigo));
    }
}
