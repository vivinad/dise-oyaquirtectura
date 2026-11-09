package pe.upn.globalfrio;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev") // estas pruebas usan H2 en memoria; la conexión a SQL Server se prueba en ConexionBdTest
class GlobalfrioApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("El contexto de Spring Boot levanta correctamente")
    void contextLoads() {
    }

    @Test
    @DisplayName("RF-SEM01-01: Endpoint /api/saludo responde 'Backend activo' con HTTP 200")
    void testSaludoEndpointRetornaBackendActivo() throws Exception {
        mockMvc.perform(get("/api/saludo"))
                .andExpect(status().isOk())
                .andExpect(content().string("Backend activo"));
    }

    @Test
    @DisplayName("Endpoint /api/saludo/detalle retorna JSON estructurado")
    void testSaludoDetalleRetornaJson() throws Exception {
        mockMvc.perform(get("/api/saludo/detalle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensaje").value("Backend activo y en ejecución"))
                .andExpect(jsonPath("$.estado").value("UP"));
    }

    @Test
    @DisplayName("GlobalExceptionHandler captura BadRequest y genera estructura canónica (Sección 7.3)")
    void testGlobalExceptionHandlerBadRequest() throws Exception {
        mockMvc.perform(get("/api/saludo/test-error?tipo=bad-request"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Parámetro inválido recibido en la prueba"))
                .andExpect(jsonPath("$.path").value("/api/saludo/test-error"));
    }

    @Test
    @DisplayName("GlobalExceptionHandler captura NotFound y genera estructura canónica (Sección 7.3)")
    void testGlobalExceptionHandlerNotFound() throws Exception {
        mockMvc.perform(get("/api/saludo/test-error?tipo=not-found"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Recurso de prueba no encontrado"))
                .andExpect(jsonPath("$.path").value("/api/saludo/test-error"));
    }

    @Test
    @DisplayName("RF-SEM01-02: Vista Thymeleaf / renderiza HTML con modelo")
    void testInicioThymeleafRender() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_HTML));
    }
}
