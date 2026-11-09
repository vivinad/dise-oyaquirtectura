# Global Frío: página web con cotizador

Proyecto del curso **Diseño y Arquitectura de Software** (UPN). Es la página web de Global Frío, una empresa de aire acondicionado en Lima, con un cotizador en línea que no pide registro:

1. El visitante elige el tipo de servicio: instalación, mantenimiento o reparación.
2. Elige el tipo de cliente: casa, negocio o empresa.
3. Ingresa el área del ambiente y el sistema le recomienda un equipo.
4. Ve el precio estimado, que suma equipos, mano de obra y traslado.
5. Descarga la cotización en PDF o la envía por WhatsApp.

## Estructura

| Carpeta | Tecnología | Contenido |
|---|---|---|
| `frontend/` | Angular 18 (HTML, CSS y TypeScript) | La página y el cotizador. |
| `backend/` | C# con ASP.NET Core 8, Dapper y AutoMapper | La API REST, dividida en capas (ver abajo). |
| `database/` | SQL Server | `BD_GLOBALFRIO.sql`: 9 tablas, datos iniciales y procedimientos almacenados. |

### Capas del backend (`backend/GlobalFrio.sln`)

| Proyecto | Responsabilidad | Ejemplo |
|---|---|---|
| `Entity` | Clases **BE**: una por tabla o resultado de procedimiento. | `ProductoBE`, `CotizacionBE` |
| `DTO` | Clases **DTO**: lo que recibe y envía la página. | `CotizacionRequestDTO`, `CatalogoCotizadorDTO` |
| `Data` | Clases **DA**: llaman a los procedimientos almacenados con Dapper. | `CotizadorDA`, `ContenidoDA` |
| `Service` | Clases **SER**: reglas de negocio y conversión BE → DTO con AutoMapper. | `CotizadorSER` (cálculo del precio) |
| `WebApiGlobalFrio` | Controladores, configuración y Swagger. | `CotizadorController` |

```
Página (Angular, :4200)  →  WebApiGlobalFrio (:8080)  →  Service  →  Data  →  SQL Server (globalfrio_db)
                              Controllers                  *SER         *DA       procedimientos usp_*
```

Las secciones **Servicios**, **Trabajos**, **Mantenimiento** y el **cotizador** salen de la base de datos. Si se cambia un dato en una tabla, la página lo muestra al recargar, sin tocar el código.

## Cómo ejecutarlo

Se necesitan el **SDK de .NET 8 o superior**, **SQL Server LocalDB** (viene con Visual Studio) y **Node.js 18 o superior**.

### 1. Backend (puerto 8080)

```powershell
cd backend\WebApiGlobalFrio
dotnet run
```

También se puede abrir `backend\GlobalFrio.sln` en Visual Studio y presionar **F5**.

**La primera vez, la API crea sola la base `globalfrio_db`** en LocalDB, con sus tablas, datos y procedimientos, ejecutando `database/BD_GLOBALFRIO.sql`. No hace falta abrir SSMS. Si la base ya existe, no la toca.

Con la API en marcha:

- **Swagger:** http://localhost:8080/swagger, para probar cada ruta con "Try it out".
- **Estado de la conexión:** http://localhost:8080/api/estado/bd, que muestra el servidor, la base de datos y cuántos registros hay en cada tabla.

Para usar otro SQL Server, cambia `ConnectionStrings:cn_bd_globalfrio` en `backend/WebApiGlobalFrio/appsettings.json`.

### 2. Frontend (puerto 4200)

En otra ventana de PowerShell:

```powershell
cd frontend
npm install
npm start
```

Abre http://localhost:4200.

## API

| Método | Ruta | Para qué sirve | Procedimiento |
|---|---|---|---|
| GET | `/api/contenido/servicios` | Tarjetas de la sección Servicios. | `usp_servicio_web_list` |
| GET | `/api/contenido/trabajos` | Fotos de la galería de Trabajos. | `usp_trabajo_list` |
| GET | `/api/contenido/mantenimiento` | Lo que incluye el mantenimiento. | `usp_item_mantenimiento_list` |
| GET | `/api/cotizador/catalogo` | Tipos de servicio y de cliente, zonas y equipos (RF01). | `usp_tipo_servicio_list`, `usp_tipo_cliente_list`, `usp_zona_list`, `usp_equipo_list` |
| GET | `/api/cotizador/recomendacion?area=25` | Equipo recomendado según el área (RF02). | `usp_equipo_para_area` |
| GET | `/api/cotizador/servicios?tipo=INSTALACION&btu=12000` | Servicios de un tipo. | `usp_servicio_list` |
| POST | `/api/cotizador/calcular` | Precio estimado, sin guardar (RF03). | — |
| POST | `/api/cotizador/cotizaciones` | Guarda la cotización y devuelve su código (RF04). | `usp_cotizacion_insert`, `usp_detalle_cotizacion_insert` |
| GET | `/api/cotizador/cotizaciones/{codigo}` | Consulta una cotización guardada (RF05). | `usp_cotizacion_get` |
| GET | `/api/estado/bd` | Comprueba la conexión con la base de datos. | `usp_estado_bd` |

**Fórmula del total:** equipos + (precio base del servicio × factor del tipo de cliente) + traslado de la zona.

Los precios de los equipos de 18 000 y 24 000 BTU, los factores por tipo de cliente y los costos de traslado son **referenciales**: hay que validarlos con la empresa.
