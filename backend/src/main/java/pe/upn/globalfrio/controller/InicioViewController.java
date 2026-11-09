package pe.upn.globalfrio.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador MVC tradicional que renderiza vistas en el servidor con Thymeleaf.
 * Demuestra el contraste formal exigido por RF-SEM01-02 (SPEC-SEM01-B):
 * @Controller con Thymeleaf (HTML) vs @RestController (JSON desacoplado).
 */
@Controller
public class InicioViewController {

    @GetMapping("/")
    public String inicio(Model model) {
        model.addAttribute("titulo", "Global Frío - Refrigeración y Climatización");
        model.addAttribute("mensaje", "Demostración de renderizado del lado del servidor (SSR) mediante Thymeleaf. "
                + "Curso Diseño y Arquitectura de Software (UPN).");
        return "inicio";
    }
}
