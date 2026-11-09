package pe.upn.globalfrio.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de OpenAPI 3 / Swagger UI.
 * Permite documentar y probar interactivamente los endpoints de la API REST de Global Frío.
 */
@Configuration
public class OpenApiConfig {

    public static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Global Frío API - Cotizador web")
                        .version("1.0.0")
                        .description("API REST para el sistema de refrigeración comercial e industrial de Global Frío SAC. "
                                + "Curso Diseño y Arquitectura de Software - Universidad Privada del Norte (UPN). "
                                + "Alineado al ODS 09: Industria, Innovación e Infraestructura.")
                        .contact(new Contact()
                                .name("Equipo de Ingeniería Global Frío - UPN")
                                .email("contacto@globalfrio.pe"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
