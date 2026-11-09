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


/* ===================== DATOS INICIALES ===================== */
/* =====================================================================
   Global Frío - Script 03: datos iniciales del cotizador
   ---------------------------------------------------------------------
   Origen de los datos:
   - REALES (publicidad de Global Frío): equipos Gree Inverter de 12 000,
     18 000 y 24 000 BTU/h; áreas de hasta 20, 30 y 40 m²; gas R410A;
     garantía de 1 año; precio especial S/ 1,250 del equipo de 12 000 BTU;
     servicios de instalación, mantenimiento (preventivo, correctivo e
     integral) y reparación; mantenimiento recomendado cada 6 meses;
     base en Ventanilla; envío a todo Lima.
   - REFERENCIALES (estimados con precios de mercado de Lima, 2026):
     precios de los equipos de 18 000 y 24 000 BTU, de los servicios,
     factores por tipo de cliente y costos de traslado por zona.
     Deben validarse con la empresa antes de publicarse.
   Precios en soles, IGV incluido.
   ===================================================================== */
GO

/* ---------- Paso 1: tipo de servicio ---------- */
INSERT INTO tipo_servicio (codigo, nombre, descripcion) VALUES
('INSTALACION',   'Instalación',   'Instalación profesional de equipos split de pared.'),
('MANTENIMIENTO', 'Mantenimiento', 'Mantenimiento preventivo, correctivo o integral. Recomendado cada 6 meses.'),
('REPARACION',    'Reparación',    'Diagnóstico de averías, reparación y repuestos.');

/* ---------- Paso 2: tipo de cliente ---------- */
-- factor_precio (referencial): en el mercado de Lima el servicio comercial cuesta más que el residencial.
INSERT INTO tipo_cliente (codigo, nombre, descripcion, factor_precio) VALUES
('HOGAR',   'Casa o departamento', 'Dormitorios, salas y ambientes del hogar.',                   1.00),
('NEGOCIO', 'Negocio',             'Tiendas, consultorios, restaurantes y locales comerciales.',  1.15),
('EMPRESA', 'Empresa',             'Oficinas, plantas y ambientes corporativos o industriales.',  1.30);

/* ---------- Zonas de atención (costo de traslado referencial desde Ventanilla) ---------- */
INSERT INTO zona (nombre, distritos, costo_traslado) VALUES
('Callao y Ventanilla', 'Ventanilla, Mi Perú, Callao, Bellavista, La Perla, La Punta, Carmen de la Legua', 20.00),
('Lima Norte',          'Puente Piedra, Carabayllo, Comas, Los Olivos, San Martín de Porres, Independencia', 30.00),
('Lima Centro',         'Cercado de Lima, Breña, Rímac, La Victoria, Jesús María, Lince, Pueblo Libre, Magdalena, San Miguel', 40.00),
('Lima Moderna',        'Miraflores, San Isidro, Santiago de Surco, San Borja, Surquillo, Barranco, La Molina', 50.00),
('Lima Este',           'Ate, Santa Anita, San Juan de Lurigancho, El Agustino, Chaclacayo', 55.00),
('Lima Sur',            'Chorrillos, San Juan de Miraflores, Villa María del Triunfo, Villa El Salvador, Lurín', 60.00);
GO

DECLARE @inst BIGINT = (SELECT id FROM tipo_servicio WHERE codigo = 'INSTALACION');
DECLARE @mant BIGINT = (SELECT id FROM tipo_servicio WHERE codigo = 'MANTENIMIENTO');
DECLARE @repa BIGINT = (SELECT id FROM tipo_servicio WHERE codigo = 'REPARACION');

/* ---------- Catálogo: EQUIPOS ---------- */
-- 12 000 BTU: precio real de la publicidad. 18 000 y 24 000: referenciales
-- (precio de mercado de Gree Inverter en Lima con el mismo descuento que aplica Global Frío al de 12 000).
-- stock: referencial.
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, capacidad_btu, area_max_m2) VALUES
('Aire acondicionado Gree Inverter 12 000 BTU/h', 'Split de pared, solo frío, gas R410A. Ideal para ambientes de hasta 20 m². Garantía 1 año.', 1250.00, 10, 'EQUIPO', 12000, 20),
('Aire acondicionado Gree Inverter 18 000 BTU/h', 'Split de pared, solo frío, gas R410A. Ideal para ambientes de hasta 30 m². Garantía 1 año.', 1690.00, 10, 'EQUIPO', 18000, 30),
('Aire acondicionado Gree Inverter 24 000 BTU/h', 'Split de pared, solo frío, gas R410A. Ideal para ambientes de hasta 40 m². Garantía 1 año.', 2290.00, 10, 'EQUIPO', 24000, 40);

/* ---------- Catálogo: SERVICIOS (precio base para HOGAR; se multiplica por el factor del tipo de cliente) ---------- */
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, capacidad_btu, tipo_servicio_id) VALUES
-- Instalación básica: unidad interior y exterior, tuberías de cobre aisladas, cableado, soporte, drenaje y puesta en marcha
('Instalación básica 12 000 BTU', 'Unidades interior y exterior, tuberías de cobre aisladas, cableado, soporte exterior, drenaje y prueba.', 350.00, 0, 'SERVICIO', 12000, @inst),
('Instalación básica 18 000 BTU', 'Unidades interior y exterior, tuberías de cobre aisladas, cableado, soporte exterior, drenaje y prueba.', 420.00, 0, 'SERVICIO', 18000, @inst),
('Instalación básica 24 000 BTU', 'Unidades interior y exterior, tuberías de cobre aisladas, cableado, soporte exterior, drenaje y prueba.', 500.00, 0, 'SERVICIO', 24000, @inst),
-- Mantenimiento preventivo
('Mantenimiento preventivo 12 000 BTU', 'Limpieza de filtros, rejillas, evaporador y condensador; revisión de gas, drenaje y conexiones; pruebas.', 120.00, 0, 'SERVICIO', 12000, @mant),
('Mantenimiento preventivo 18 000 BTU', 'Limpieza de filtros, rejillas, evaporador y condensador; revisión de gas, drenaje y conexiones; pruebas.', 150.00, 0, 'SERVICIO', 18000, @mant),
('Mantenimiento preventivo 24 000 BTU', 'Limpieza de filtros, rejillas, evaporador y condensador; revisión de gas, drenaje y conexiones; pruebas.', 180.00, 0, 'SERVICIO', 24000, @mant),
-- Mantenimiento correctivo (repuestos aparte)
('Mantenimiento correctivo 12 000 BTU', 'Diagnóstico y solución de fallas para que el equipo funcione al 100%. No incluye repuestos.', 160.00, 0, 'SERVICIO', 12000, @mant),
('Mantenimiento correctivo 18 000 BTU', 'Diagnóstico y solución de fallas para que el equipo funcione al 100%. No incluye repuestos.', 190.00, 0, 'SERVICIO', 18000, @mant),
('Mantenimiento correctivo 24 000 BTU', 'Diagnóstico y solución de fallas para que el equipo funcione al 100%. No incluye repuestos.', 220.00, 0, 'SERVICIO', 24000, @mant),
-- Mantenimiento integral (preventivo + correctivo)
('Mantenimiento integral 12 000 BTU', 'Preventivo + correctivo: limpieza profunda interior y exterior y optimización del consumo.', 220.00, 0, 'SERVICIO', 12000, @mant),
('Mantenimiento integral 18 000 BTU', 'Preventivo + correctivo: limpieza profunda interior y exterior y optimización del consumo.', 260.00, 0, 'SERVICIO', 18000, @mant),
('Mantenimiento integral 24 000 BTU', 'Preventivo + correctivo: limpieza profunda interior y exterior y optimización del consumo.', 300.00, 0, 'SERVICIO', 24000, @mant),
-- Reparación
('Diagnóstico técnico',                  'Visita técnica para identificar la falla. Se descuenta si se aprueba la reparación.', 80.00, 0, 'SERVICIO', NULL, @repa),
('Recarga de gas R410A 12 000 BTU',      'Detección de fugas y recarga de refrigerante R410A.', 180.00, 0, 'SERVICIO', 12000, @repa),
('Recarga de gas R410A 18 000 BTU',      'Detección de fugas y recarga de refrigerante R410A.', 220.00, 0, 'SERVICIO', 18000, @repa),
('Recarga de gas R410A 24 000 BTU',      'Detección de fugas y recarga de refrigerante R410A.', 260.00, 0, 'SERVICIO', 24000, @repa),
('Reparación de fallas eléctricas',      'Revisión y reparación de tarjeta, sensores y conexiones. No incluye repuestos.', 150.00, 0, 'SERVICIO', NULL, @repa),
('Solución de drenaje y fugas de agua',  'Destape y corrección del drenaje para evitar goteras y humedad.', 120.00, 0, 'SERVICIO', NULL, @repa);
GO

/* ---------- Cotización de EJEMPLO (para comprobar RF03 y RF04) ----------
   Casa de 18 m² en Los Olivos que necesita instalación:
   equipo 12 000 BTU (1 250) + instalación (350 × 1.00) + traslado Lima Norte (30) = S/ 1 630 */
DECLARE @cot BIGINT;
INSERT INTO cotizacion (codigo, tipo_servicio_id, tipo_cliente_id, zona_id, area_m2, btu_recomendado,
                        subtotal_equipos, subtotal_mano_obra, costo_traslado, total)
VALUES ('COT-2026-000001',
        (SELECT id FROM tipo_servicio WHERE codigo = 'INSTALACION'),
        (SELECT id FROM tipo_cliente  WHERE codigo = 'HOGAR'),
        (SELECT id FROM zona          WHERE nombre = 'Lima Norte'),
        18.00, 12000, 1250.00, 350.00, 30.00, 1630.00);
SET @cot = SCOPE_IDENTITY();

INSERT INTO detalle_cotizacion (cotizacion_id, producto_id, cantidad, precio_unitario, subtotal)
SELECT @cot, id, 1, precio, precio FROM productos
WHERE nombre IN ('Aire acondicionado Gree Inverter 12 000 BTU/h', 'Instalación básica 12 000 BTU');
GO

SELECT categoria, COUNT(*) AS cantidad FROM productos GROUP BY categoria;

PRINT 'LISTO: base de datos globalfrio_db creada con sus datos.';
