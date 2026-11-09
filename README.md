# Global Frío: cotizador web

Proyecto del curso **Diseño y Arquitectura de Software** (UPN). Es una página web para Global Frío, una empresa de aire acondicionado en Lima. El visitante cotiza en línea, sin registrarse:

1. Elige el tipo de servicio: instalación, mantenimiento o reparación.
2. Elige el tipo de cliente: casa, negocio o empresa.
3. Ingresa el área del ambiente y el sistema le recomienda un equipo.
4. Ve el precio estimado, que suma equipos, mano de obra y traslado.
5. Descarga la cotización en PDF o la envía por WhatsApp.

## Estructura

| Carpeta | Contenido |
|---|---|
| `frontend/` | Página en Angular 18 con el cotizador (`src/app/components/cotizador`). También incluye `prototipo-vanilla/`, la primera versión en HTML, CSS y JS. |
| `backend/` | API REST en Spring Boot 3 (Java 17), con arquitectura en capas: `controller → service → repository → entity`. |
| `database/` | Scripts SQL Server del modelo físico, con datos iniciales y consultas de prueba. |

## Cómo ejecutarlo

Se necesitan **Java 17** y **Node.js 18 o superior**.

### 1. Backend (puerto 8080)

Por defecto usa una base de datos **H2 en memoria**, que se crea sola con las mismas tablas y datos. No hace falta instalar SQL Server.

```powershell
cd backend
# Solo si sale el error de JAVA_HOME:
$env:JAVA_HOME = ((java -XshowSettings:properties -version 2>&1 | Select-String "java.home") -split "=")[1].Trim()
.\mvnw.cmd spring-boot:run
```

Con el backend en marcha, hay tres páginas útiles:

- **Swagger:** http://localhost:8080/swagger-ui/index.html
- **Consola H2:** http://localhost:8080/h2-console, con JDBC URL `jdbc:h2:mem:globalfriodb`, usuario `sa` y contraseña vacía.
- **Catálogo del cotizador:** http://localhost:8080/api/cotizador/catalogo

### 2. Frontend (puerto 4200)

En otra ventana de PowerShell:

```powershell
cd frontend
npm install
npm start
```

Abre http://localhost:4200 y pulsa **Cotizar**.

### 3. Base de datos en SQL Server (opcional)

Los scripts y el paso a paso están en [`database/LEEME_BD.md`](database/LEEME_BD.md). Luego se inicia el backend con el perfil `sqlserver`:

```powershell
$env:SPRING_PROFILES_ACTIVE = "sqlserver"
$env:DB_USUARIO = "sa"
$env:DB_CLAVE   = "tu-contraseña"
.\mvnw.cmd spring-boot:run
```

## API del cotizador

| Método | Ruta | Para qué sirve |
|---|---|---|
| GET | `/api/cotizador/catalogo` | Tipos de servicio, tipos de cliente, zonas y equipos. |
| GET | `/api/cotizador/recomendacion?area=25` | Equipo recomendado según el área (RF02). |
| GET | `/api/cotizador/servicios?tipo=INSTALACION&btu=12000` | Servicios de un tipo. |
| POST | `/api/cotizador/calcular` | Precio estimado, sin guardar (RF03). |
| POST | `/api/cotizador/cotizaciones` | Guarda la cotización y devuelve su código (RF04). |
| GET | `/api/cotizador/cotizaciones/{codigo}` | Consulta una cotización guardada (RF05). |

**Fórmula del total:** equipos + (precio base del servicio × factor del tipo de cliente) + traslado de la zona.
