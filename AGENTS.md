# AGENTS.md — Especificación Canónica Frontend (Angular SPA)

| Parámetro | Detalle |
|---|---|
| **Curso & Código** | Soluciones Web y Aplicaciones Distribuidas (SIST1402A) — 3 Créditos — Ciclo 8° / 9° |
| **Institución & Periodo** | Universidad Privada del Norte (UPN) — Facultad de Ingeniería — Periodo 2026-2 |
| **Docente de Cátedra** | Ing. Mg. Carlos Alberto Ponte Ramírez |
| **Alineación Estratégica** | ODS 09: Industria, Innovación e Infraestructura |
| **Audiencia** | Google Jules, Antigravity CLI, Agentes Autónomos y Desarrolladores Frontend |

---

## 1. Reglas Mandatarias de Ingeniería y Lista Blanca Estricta Frontend

1. **Lista Blanca Tecnológica Absoluta:** Queda terminantemente prohibido utilizar librerías, dependencias en `package.json`, frameworks de CSS o utilidades externas distintas a las autorizadas en las diapositivas y guías de laboratorio del curso (Angular, TypeScript, SASS, Bootstrap 5, Angular Material y RxJS).
2. **Progresión Didáctica Oficial:**
   - **Semana 07:** Introducción formal de Single Page Application (SPA) con Angular CLI, Componentes modulares, Data Binding, Directivas estructurales (`*ngIf`, `*ngFor`), SASS (`styles.scss`) y Bootstrap 5.
   - **Semana 08:** Data Services con `HttpClient`, Observables de RxJS, Routing (`RouterModule`), Query Params, Formularios Reactivos (`ReactiveFormsModule`), Almacenamiento de Token JWT e Interceptor HTTP.
   - **Semana 09:** Integración E2E con backend Spring Boot, retroalimentación visual al usuario ante errores HTTP (400, 401, 403, 404, 500).
   - **Semana 10 (Hito T2):** Sustentación de la SPA integrada con login, rutas privadas mediante Route Guards y CRUD completo.
   - **Semana 11:** Paginación de colecciones de datos y filtros.
3. **Cero Mocks Ciegos:** Todos los componentes, datos y servicios deben ser deterministas y funcionales.
4. **Trazabilidad Obligatoria:** Todo commit, issue o PR debe referenciar su código funcional (ej. `[RF-SEM07-01]`, `[RF-SEM08-01]`).

---

## 2. Pila Tecnológica Autorizada y Dependencias Frontend

### 2.1. Dominio Tecnológico Autorizado
* **Framework:** Angular 18.x / 19.x (SPA modular o standalone con NgModules canónicos).
* **Lenguaje:** TypeScript 5.x estricto.
* **Estilos:** SASS/SCSS (`src/styles.scss`), CSS3 Flexbox y CSS Grid.
* **Frameworks UI:** Bootstrap 5 (`bootstrap`), Angular Material (`@angular/material`, `@angular/cdk`).
* **Manejo de Estado Asíncrono:** RxJS (`Observable`, `Subject`, `BehaviorSubject`, operadores `pipe`, `map`, `catchError`, `of`).
* **Cliente HTTP:** `HttpClientModule` / `HttpClient`.
* **Enrutamiento:** `RouterModule`, `Routes`, `router-outlet`, `routerLink`, `ActivatedRoute`.
* **Seguridad Cliente:** `HttpInterceptor` (inyección de cabecera `Authorization: Bearer <token>`), `CanActivate` Route Guards (`AuthGuard`).
* **Ejecución Local:** `ng serve` en el puerto `4200` (`http://localhost:4200`).

### 2.2. Lista Blanca de Dependencias en `package.json`
* `@angular/core`, `@angular/common`, `@angular/compiler`, `@angular/platform-browser`, `@angular/platform-browser-dynamic`
* `@angular/router`, `@angular/forms`
* `@angular/material`, `@angular/cdk`
* `rxjs`, `zone.js`, `tslib`
* `bootstrap`
* `@angular/cli`, `@angular-devkit/build-angular`, `@angular/compiler-cli`, `typescript`

---

## 3. Estructura Arquitectónica del Frontend (`frontend/`)

```
frontend/
├── angular.json                                     Configuración del workspace y build
├── package.json                                     Dependencias oficiales autorizadas
├── tsconfig.json / tsconfig.app.json                Configuración estricta de TypeScript
├── AGENTS.md                                        Ficha técnica canónica del frontend
└── src/
    ├── index.html                                   Esqueleto base HTML con fuentes y meta tags
    ├── main.ts                                      Punto de entrada: bootstrap de la aplicación
    ├── styles.scss                                  Estilos globales (Design tokens, variables y base)
    ├── assets/                                      Fotografías e iconografía corporativa
    │   ├── logo.png
    │   ├── hero.jpg
    │   └── *.jpg (obras y galería)
    ├── environments/
    │   ├── environment.ts                           Variables de desarrollo (apiUrl: http://localhost:8080/api)
    │   └── environment.prod.ts                      Variables de producción
    └── app/
        ├── app.module.ts                            Declaraciones de componentes y configuración HTTP
        ├── app-routing.module.ts                    Rutas SPA y scroll restoration
        ├── app.component.ts / html / scss           Layout contenedor raíz
        ├── models/                                  Interfaces TypeScript de datos
        │   ├── red-social.model.ts
        │   ├── servicio.model.ts
        │   ├── trabajo.model.ts
        │   ├── item-mantenimiento.model.ts
        │   └── config.model.ts
        ├── services/                                Servicios inyectables con RxJS
        │   ├── api.service.ts                       Cliente REST genérico sobre HttpClient
        │   ├── config.service.ts                    Fuente única de verdad (teléfono, mapas, empresa)
        │   ├── ambiente.service.ts                  Tema claro/oscuro con BehaviorSubject y localStorage
        │   ├── servicios.service.ts                 Catálogo de servicios de climatización
        │   ├── trabajos.service.ts                  Galería de instalaciones ejecutadas
        │   ├── mantenimiento.service.ts             Checklist semestral
        │   └── modal.service.ts                     Control reactivo del modal de contacto
        ├── core/
        │   ├── guards/
        │   │   └── auth.guard.ts                    Protección de rutas privadas
        │   └── interceptors/
        │       └── jwt.interceptor.ts               Inyección de cabecera Bearer Token
        └── components/                              Componentes visuales modulares (.ts, .html, .scss)
            ├── header/                              Barra superior, navegación y selector de tema
            ├── hero/                                Sección principal con llamado a la acción
            ├── servicios/                           Grilla de tarjetas de servicios (/01 - /04)
            ├── trabajos/                            Galería de fichas y CTA para cotización en obra
            ├── mantenimiento/                       Banda invertida y checklist preventivo
            ├── ubicacion/                           Ubicación física y mapa Google embebido
            ├── footer/                              Pie institucional y redes sociales
            └── modal/                               Diálogo accesible para contacto rápido
```

---

## 4. Requerimientos Funcionales y Especificaciones Técnicas Frontend

| Código | Requerimiento Funcional y Alcance | Pila Técnica y Especificaciones | Criterio de Aceptación Determinista |
|---|---|---|---|
| `RF-SEM07-01`<br>`SPEC-SEM07-A` | **Estructura SPA y Componentes:** Modularización de vistas mediante Angular CLI. | Componentes modulares con separación estricta de `.ts`, `.html` y `.scss`. | Aplicación compila sin advertencias y corre en `http://localhost:4200`. |
| `RF-SEM07-02`<br>`SPEC-SEM07-B` | **Data Binding y Directivas:** Interpolación, Property Binding, Event Binding y directivas estructurales. | `{{ }}`, `[src]`, `[href]`, `(click)`, `*ngIf`, `*ngFor`. | Los componentes presentan datos dinámicos provenientes de los modelos sin hardcoding en plantillas. |
| `RF-SEM07-03`<br>`SPEC-SEM07-C` | **Diseño Responsivo e Industrial:** Sistema visual con tokens de diseño, soporte claro/oscuro y marcos técnicos. | Bootstrap 5, variables CSS en `styles.scss`, marcos `.blueprint` con esquinas `.corner` y efecto `.duotone`. | La interfaz se adapta a pantallas móviles (320px), tablets y escritorio (1240px). |
| `RF-SEM08-01`<br>`SPEC-SEM08-A` | **Consumo de Datos vía Services:** Abstracción de acceso a datos con RxJS. | Clases `@Injectable({ providedIn: 'root' })`, retorno de `Observable<T>`. | Servicios retornan colecciones tipadas consumibles de forma síncrona o asíncrona. |
| `RF-SEM08-02`<br>`SPEC-SEM08-B` | **Routing y Formularios:** Navegación interna y captura de información. | `RouterModule`, `Routes`, `ReactiveFormsModule` (`FormGroup`, `Validators`). | Rutas definidas sin recargas completas de navegador; formularios con validación en tiempo real. |
| `RF-SEM08-03`<br>`SPEC-SEM08-C` | **Seguridad Stateless JWT en Cliente:** Gestión de sesión e interceptor HTTP. | `HttpInterceptor`, inyección de cabecera `Authorization: Bearer <token>`, `AuthGuard`. | Peticiones HTTP incluyen automáticamente el token si existe en almacenamiento local. |
| `RF-SEM09-01`<br>`SPEC-SEM09-A` | **Integración E2E con Backend:** Conexión con Spring Boot REST endpoints. | `HttpClient`, consumo de `environment.apiUrl`. | Interfaz refleja inmediatamente altas, bajas y modificaciones registradas en backend. |
| `RF-SEM09-02`<br>`SPEC-SEM09-B` | **Manejo de Errores y Retroalimentación:** Respuestas amigables ante fallos de servidor o validaciones. | Operador RxJS `catchError`, alertas visuales Bootstrap / SnackBar Material. | Errores 400, 401, 403, 404 y 500 informan claramente al usuario sin congelar la interfaz. |
