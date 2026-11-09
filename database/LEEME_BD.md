# Base de datos del cotizador de Global Frío (SQL Server)

La base `globalfrio_db` soporta el flujo del cotizador web:

1. El visitante ve la publicidad y pulsa **Cotizar**.
2. Elige el **tipo de servicio**: instalación, mantenimiento o reparación.
3. Elige el **tipo de cliente**: casa, negocio o empresa.
4. Indica el tamaño del ambiente y el sistema **recomienda el equipo** (RF02).
5. Elige equipos y servicios y ve el **precio estimado**: equipos + mano de obra + traslado (RF03).
6. La cotización **se guarda** (RF04) y se **descarga** (RF05).
7. Si desea concretar, pasa a **WhatsApp** con el código de su cotización. No hay registro ni login para los visitantes.

Esta carpeta contiene el **modelo físico** de esa base, que es el último paso del flujo visto en DIARS:

**modelo conceptual → modelo lógico → modelo físico → script de BD (DDL)**

| Archivo | Para qué sirve |
|---|---|
| `01_crear_base_datos.sql` | Crea las 6 tablas: `tipo_servicio`, `tipo_cliente`, `zona`, `productos` (equipos y servicios), `cotizacion` y `detalle_cotizacion`. |
| `03_datos_iniciales.sql` | Carga los 3 equipos Gree, 18 servicios, los tipos de servicio y de cliente, 6 zonas de Lima y una cotización de ejemplo. |
| `04_consultas_cotizador.sql` | Consultas de RF01 a RF05 para probar la lógica en SSMS antes de programarla. |

**Origen de los datos de `03_datos_iniciales.sql`:**
- **Reales**, tomados de la publicidad de Global Frío: los equipos Gree Inverter de 12 000, 18 000 y 24 000 BTU, las áreas de 20, 30 y 40 m², el precio de S/ 1,250 del equipo de 12 000 BTU, los servicios y el mantenimiento cada 6 meses.
- **Referenciales**, estimados con precios de mercado de Lima: el resto de precios, los factores por tipo de cliente y los costos de traslado. **Validarlos con la empresa.**

---

## Opción rápida: sin instalar nada (H2, por defecto)

El backend trae una base de datos **H2 en memoria** con las mismas 6 tablas y los mismos datos (`backend/src/main/resources/db/h2/`). Se crea sola al iniciar y se borra al detenerlo; **no se conecta a ningún SQL Server**.

Desde la raíz del repositorio:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

- Para ver las tablas, abre http://localhost:8080/h2-console con JDBC URL `jdbc:h2:mem:globalfriodb`, usuario `sa` y contraseña vacía.
- Para probar la conexión: `.\mvnw.cmd test -Dtest=ConexionBdTest`

## Opción SQL Server

Para usar SQL Server, ejecuta los pasos siguientes y activa el perfil `sqlserver` antes de iniciar el backend:

```powershell
$env:SPRING_PROFILES_ACTIVE = "sqlserver"
```

## Paso 1. Preparar SQL Server (una sola vez)

1. **Autenticación mixta.** Abre SSMS, haz clic derecho en el servidor → *Properties* → *Security* y marca **SQL Server and Windows Authentication mode**. Reinicia el servicio.
2. **TCP/IP en el puerto 1433.** Abre *SQL Server Configuration Manager* → *SQL Server Network Configuration* → *Protocols for …* y activa **TCP/IP**.
   - Si tu instancia es **SQLEXPRESS**, usa un puerto dinámico. Entra a *TCP/IP* → *IP Addresses* → *IPAll*, deja vacío *TCP Dynamic Ports* y escribe `1433` en *TCP Port*.
   - Luego reinicia el servicio *SQL Server (…)*.

## Paso 2. Crear la base de datos

Los scripts están en esta carpeta (`database/`). En SSMS, conectado como `sa` o como tu usuario de Windows, abre y ejecuta con **F5**, en este orden:

1. `01_crear_base_datos.sql`
2. `03_datos_iniciales.sql`
3. `04_consultas_cotizador.sql` (opcional): muestra el catálogo, la recomendación de equipo, un precio estimado y la cotización de ejemplo.

Al terminar debes ver las 6 tablas en *globalfrio_db → Tables*. El último `SELECT` debe mostrar EQUIPO = 3 y SERVICIO = 18.

## Paso 3. Darle la contraseña al backend (sin escribirla en el código)

El backend lee el usuario y la contraseña de **variables de entorno**, así no se suben a GitHub. En PowerShell, dentro de la carpeta `backend`:

```powershell
$env:DB_USUARIO = "sa"
$env:DB_CLAVE   = "la-contraseña-de-sa"
```

Estas variables duran mientras esa ventana de PowerShell esté abierta.

## Paso 4. Probar la conexión

En esa misma ventana:

```powershell
.\mvnw.cmd test -Dtest=ConexionBdTest
```

Si todo está bien, verás `Tests run: 2, Failures: 0` y en la consola algo como:

```
Conectado a: Microsoft SQL Server ...
Base de datos: globalfrio_db
Registros en la tabla productos (equipos y servicios): 21
```

Para levantar el backend conectado a SQL Server:

```powershell
.\mvnw.cmd spring-boot:run
```

En los logs debe aparecer `HikariPool-1 - Start completed.` sin errores.

---

## Errores frecuentes

| Mensaje | Causa y solución |
|---|---|
| `The TCP/IP connection to the host localhost, port 1433 has failed` | TCP/IP está desactivado o la instancia no escucha en 1433. Revisa el Paso 1.2. |
| `Login failed for user 'sa'` | La contraseña de `DB_CLAVE` es incorrecta, el login `sa` está deshabilitado o la autenticación mixta no está activa. |
| `Cannot open database "globalfrio_db"` | No se ejecutó el script 01. |
| `Schema-validation: missing table [...]` o `missing column [...]` | La entidad Java y la tabla no coinciden. Hibernate valida la estructura al iniciar (`ddl-auto=validate`), así que hay que ajustar el script o la entidad. |
| `PKIX path building failed` | Falta `trustServerCertificate=true` en la URL; ya viene incluido en `application-sqlserver.properties`. |
