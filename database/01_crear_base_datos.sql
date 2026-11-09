/* =====================================================================
   Global Frío - Cotizador web
   Script 01: Modelo físico de la base de datos (SQL Server)
   ---------------------------------------------------------------------
   Flujo que soporta:
     1. El visitante elige el TIPO DE SERVICIO (instalación, mantenimiento
        o reparación).
     2. Elige el TIPO DE CLIENTE (casa, negocio o empresa).
     3. Indica el tamaño del ambiente y el sistema le recomienda un equipo
        (RF02).
     4. Elige equipos y/o servicios y ve un precio estimado:
        equipos + mano de obra + traslado (RF03).
     5. La cotización se guarda (RF04) y se puede descargar (RF05).
     6. Si el cliente desea concretar, se le dirige a WhatsApp con el
        código de su cotización. No se pide registro ni datos personales.

   Tipos: VARCHAR (texto), NUMERIC(10,2) (montos en soles, IGV incluido),
   BIT (verdadero/falso), DATETIME2 (fecha y hora) y CHECK en lugar de
   ENUM (SQL Server no tiene ENUM).

   Ejecutar en SSMS con un usuario que pueda crear bases de datos (sa).
   Se puede volver a ejecutar: borra y recrea las tablas.
   ===================================================================== */

IF DB_ID(N'globalfrio_db') IS NULL
    CREATE DATABASE globalfrio_db;
GO

USE globalfrio_db;
GO

/* ---------- Borrado en orden inverso a las dependencias ---------- */
DROP TABLE IF EXISTS detalle_cotizacion;
DROP TABLE IF EXISTS cotizacion;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS zona;
DROP TABLE IF EXISTS tipo_cliente;
DROP TABLE IF EXISTS tipo_servicio;
GO

/* ============================ CATÁLOGOS ============================ */

-- Paso 1 del cotizador: ¿qué necesita el cliente?
CREATE TABLE tipo_servicio (
    id          BIGINT IDENTITY(1,1) NOT NULL,
    codigo      VARCHAR(20)          NOT NULL,
    nombre      VARCHAR(60)          NOT NULL,
    descripcion VARCHAR(255)         NULL,
    activo      BIT                  NOT NULL CONSTRAINT df_tipo_servicio_activo DEFAULT 1,
    CONSTRAINT pk_tipo_servicio PRIMARY KEY (id),
    CONSTRAINT uq_tipo_servicio_codigo UNIQUE (codigo),
    CONSTRAINT ck_tipo_servicio_codigo CHECK (codigo IN ('INSTALACION','MANTENIMIENTO','REPARACION'))
);

-- Paso 2 del cotizador: ¿para qué tipo de lugar?
-- factor_precio ajusta la mano de obra (los ambientes comerciales tienen más horas de uso y mayor exigencia).
CREATE TABLE tipo_cliente (
    id            BIGINT IDENTITY(1,1) NOT NULL,
    codigo        VARCHAR(20)          NOT NULL,
    nombre        VARCHAR(60)          NOT NULL,
    descripcion   VARCHAR(255)         NULL,
    factor_precio NUMERIC(4,2)         NOT NULL CONSTRAINT df_tipo_cliente_factor DEFAULT 1.00,
    activo        BIT                  NOT NULL CONSTRAINT df_tipo_cliente_activo DEFAULT 1,
    CONSTRAINT pk_tipo_cliente PRIMARY KEY (id),
    CONSTRAINT uq_tipo_cliente_codigo UNIQUE (codigo),
    CONSTRAINT ck_tipo_cliente_codigo CHECK (codigo IN ('HOGAR','NEGOCIO','EMPRESA')),
    CONSTRAINT ck_tipo_cliente_factor CHECK (factor_precio > 0)
);

-- Zonas de atención desde la base en Ventanilla, con su costo de traslado.
CREATE TABLE zona (
    id             BIGINT IDENTITY(1,1) NOT NULL,
    nombre         VARCHAR(60)          NOT NULL,
    distritos      VARCHAR(400)         NULL,
    costo_traslado NUMERIC(10,2)        NOT NULL,
    activo         BIT                  NOT NULL CONSTRAINT df_zona_activo DEFAULT 1,
    CONSTRAINT pk_zona PRIMARY KEY (id),
    CONSTRAINT uq_zona_nombre UNIQUE (nombre),
    CONSTRAINT ck_zona_costo CHECK (costo_traslado >= 0)
);

/* Catálogo de EQUIPOS y SERVICIOS (RF01).
   Mapeada por la entidad JPA pe.upn.globalfrio.entity.Producto (@Table(name = "productos")).
   Las columnas id, nombre, descripcion, precio, stock, categoria y activo deben coincidir con la
   entidad: Hibernate las valida al iniciar (spring.jpa.hibernate.ddl-auto=validate).
   Las columnas capacidad_btu, area_max_m2 y tipo_servicio_id también están mapeadas en la entidad. */
CREATE TABLE productos (
    id               BIGINT IDENTITY(1,1) NOT NULL,
    nombre           VARCHAR(100)         NOT NULL,
    descripcion      VARCHAR(255)         NULL,
    precio           NUMERIC(10,2)        NOT NULL,   -- equipos: precio de venta; servicios: precio base para HOGAR
    stock            INT                  NOT NULL,   -- servicios: 0 (no aplica)
    categoria        VARCHAR(50)          NOT NULL,   -- EQUIPO | SERVICIO
    activo           BIT                  NOT NULL CONSTRAINT df_productos_activo DEFAULT 1,
    capacidad_btu    INT                  NULL,       -- 12000, 18000, 24000 (NULL si el servicio aplica a cualquier equipo)
    area_max_m2      INT                  NULL,       -- solo equipos: área máxima recomendada (RF02)
    tipo_servicio_id BIGINT               NULL,       -- solo servicios: instalación, mantenimiento o reparación
    CONSTRAINT pk_productos PRIMARY KEY (id),
    CONSTRAINT fk_productos_tipo_servicio FOREIGN KEY (tipo_servicio_id) REFERENCES tipo_servicio(id),
    CONSTRAINT ck_productos_categoria CHECK (categoria IN ('EQUIPO','SERVICIO')),
    CONSTRAINT ck_productos_precio CHECK (precio > 0),
    CONSTRAINT ck_productos_stock CHECK (stock >= 0),
    CONSTRAINT ck_productos_equipo CHECK (categoria <> 'EQUIPO' OR (capacidad_btu IS NOT NULL AND area_max_m2 IS NOT NULL)),
    CONSTRAINT ck_productos_servicio CHECK (categoria <> 'SERVICIO' OR tipo_servicio_id IS NOT NULL)
);

/* ============================ COTIZACIONES ============================ */

-- Cabecera de la cotización (RF04): servicio elegido, tipo de cliente, zona y precio.
CREATE TABLE cotizacion (
    id                       BIGINT IDENTITY(1,1) NOT NULL,
    codigo                   VARCHAR(20)          NOT NULL,   -- ej. COT-2026-000001, se muestra en el PDF (RF05)
    fecha                    DATETIME2            NOT NULL CONSTRAINT df_cotizacion_fecha DEFAULT SYSDATETIME(),
    tipo_servicio_id         BIGINT               NOT NULL,
    tipo_cliente_id          BIGINT               NOT NULL,
    zona_id                  BIGINT               NOT NULL,
    area_m2                  NUMERIC(6,2)         NULL,       -- tamaño del ambiente ingresado (RF02)
    btu_recomendado          INT                  NULL,       -- capacidad sugerida por el sistema
    subtotal_equipos         NUMERIC(10,2)        NOT NULL CONSTRAINT df_cotizacion_eq DEFAULT 0,
    subtotal_mano_obra       NUMERIC(10,2)        NOT NULL CONSTRAINT df_cotizacion_mo DEFAULT 0,
    costo_traslado           NUMERIC(10,2)        NOT NULL CONSTRAINT df_cotizacion_tr DEFAULT 0,
    total                    NUMERIC(10,2)        NOT NULL,   -- RF03: equipos + mano de obra + traslado (IGV incluido)
    estado                   VARCHAR(15)          NOT NULL CONSTRAINT df_cotizacion_estado DEFAULT 'GENERADA',
    CONSTRAINT pk_cotizacion PRIMARY KEY (id),
    CONSTRAINT uq_cotizacion_codigo UNIQUE (codigo),
    CONSTRAINT fk_cotizacion_tipo_servicio FOREIGN KEY (tipo_servicio_id) REFERENCES tipo_servicio(id),
    CONSTRAINT fk_cotizacion_tipo_cliente FOREIGN KEY (tipo_cliente_id) REFERENCES tipo_cliente(id),
    CONSTRAINT fk_cotizacion_zona FOREIGN KEY (zona_id) REFERENCES zona(id),
    CONSTRAINT ck_cotizacion_area CHECK (area_m2 IS NULL OR area_m2 > 0),
    CONSTRAINT ck_cotizacion_total CHECK (total = subtotal_equipos + subtotal_mano_obra + costo_traslado),
    CONSTRAINT ck_cotizacion_estado CHECK (estado IN ('GENERADA','CONTACTADO','ACEPTADA','DESCARTADA'))
);

-- Líneas de la cotización: cada equipo o servicio elegido.
CREATE TABLE detalle_cotizacion (
    id              BIGINT IDENTITY(1,1) NOT NULL,
    cotizacion_id   BIGINT               NOT NULL,
    producto_id     BIGINT               NOT NULL,
    cantidad        INT                  NOT NULL CONSTRAINT df_detalle_cantidad DEFAULT 1,
    precio_unitario NUMERIC(10,2)        NOT NULL,   -- precio aplicado (servicios: precio base × factor del tipo de cliente)
    subtotal        NUMERIC(10,2)        NOT NULL,
    CONSTRAINT pk_detalle_cotizacion PRIMARY KEY (id),
    CONSTRAINT fk_detalle_cotizacion FOREIGN KEY (cotizacion_id) REFERENCES cotizacion(id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id),
    CONSTRAINT ck_detalle_cantidad CHECK (cantidad > 0),
    CONSTRAINT ck_detalle_subtotal CHECK (subtotal = cantidad * precio_unitario)
);
GO

/* ============================ ÍNDICES ============================= */
CREATE INDEX ix_productos_categoria   ON productos (categoria, activo);
CREATE INDEX ix_productos_servicio    ON productos (tipo_servicio_id, capacidad_btu);
CREATE INDEX ix_cotizacion_fecha      ON cotizacion (fecha);
CREATE INDEX ix_detalle_cotizacion    ON detalle_cotizacion (cotizacion_id);
GO

PRINT 'Base de datos globalfrio_db creada correctamente.';
