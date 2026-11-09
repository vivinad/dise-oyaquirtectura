-- =====================================================================
-- Global Frío - Datos iniciales para H2 (perfil "dev")
-- Mismos datos de database/03_datos_iniciales.sql (SQL Server).
-- Reales: equipos Gree 12 000 / 18 000 / 24 000 BTU, áreas 20/30/40 m2,
-- precio S/ 1,250 del equipo de 12 000 BTU, servicios de la publicidad.
-- Referenciales (validar con la empresa): demás precios, factores y traslados.
-- =====================================================================
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





/* ---------- Catálogo: EQUIPOS ---------- */
-- 12 000 BTU: precio real de la publicidad. 18 000 y 24 000: referenciales
-- (precio de mercado de Gree Inverter en Lima con el mismo descuento que aplica Global Frío al de 12 000).
-- stock: referencial.
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, capacidad_btu, area_max_m2) VALUES
('Aire acondicionado Gree Inverter 12 000 BTU/h', 'Split de pared, solo frío, gas R410A. Ideal para ambientes de hasta 20 m². Garantía 1 año.', 1250.00, 10, 'EQUIPO', 12000, 20),
('Aire acondicionado Gree Inverter 18 000 BTU/h', 'Split de pared, solo frío, gas R410A. Ideal para ambientes de hasta 30 m². Garantía 1 año.', 1690.00, 10, 'EQUIPO', 18000, 30),
('Aire acondicionado Gree Inverter 24 000 BTU/h', 'Split de pared, solo frío, gas R410A. Ideal para ambientes de hasta 40 m². Garantía 1 año.', 2290.00, 10, 'EQUIPO', 24000, 40);

/* ---------- Catálogo: SERVICIOS (precio base para HOGAR, se multiplica por el factor del tipo de cliente) ---------- */
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, capacidad_btu, tipo_servicio_id) VALUES
-- Instalación básica: unidad interior y exterior, tuberías de cobre aisladas, cableado, soporte, drenaje y puesta en marcha
('Instalación básica 12 000 BTU', 'Unidades interior y exterior, tuberías de cobre aisladas, cableado, soporte exterior, drenaje y prueba.', 350.00, 0, 'SERVICIO', 12000, (SELECT id FROM tipo_servicio WHERE codigo = 'INSTALACION')),
('Instalación básica 18 000 BTU', 'Unidades interior y exterior, tuberías de cobre aisladas, cableado, soporte exterior, drenaje y prueba.', 420.00, 0, 'SERVICIO', 18000, (SELECT id FROM tipo_servicio WHERE codigo = 'INSTALACION')),
('Instalación básica 24 000 BTU', 'Unidades interior y exterior, tuberías de cobre aisladas, cableado, soporte exterior, drenaje y prueba.', 500.00, 0, 'SERVICIO', 24000, (SELECT id FROM tipo_servicio WHERE codigo = 'INSTALACION')),
-- Mantenimiento preventivo
('Mantenimiento preventivo 12 000 BTU', 'Limpieza de filtros, rejillas, evaporador y condensador, revisión de gas, drenaje y conexiones, pruebas.', 120.00, 0, 'SERVICIO', 12000, (SELECT id FROM tipo_servicio WHERE codigo = 'MANTENIMIENTO')),
('Mantenimiento preventivo 18 000 BTU', 'Limpieza de filtros, rejillas, evaporador y condensador, revisión de gas, drenaje y conexiones, pruebas.', 150.00, 0, 'SERVICIO', 18000, (SELECT id FROM tipo_servicio WHERE codigo = 'MANTENIMIENTO')),
('Mantenimiento preventivo 24 000 BTU', 'Limpieza de filtros, rejillas, evaporador y condensador, revisión de gas, drenaje y conexiones, pruebas.', 180.00, 0, 'SERVICIO', 24000, (SELECT id FROM tipo_servicio WHERE codigo = 'MANTENIMIENTO')),
-- Mantenimiento correctivo (repuestos aparte)
('Mantenimiento correctivo 12 000 BTU', 'Diagnóstico y solución de fallas para que el equipo funcione al 100%. No incluye repuestos.', 160.00, 0, 'SERVICIO', 12000, (SELECT id FROM tipo_servicio WHERE codigo = 'MANTENIMIENTO')),
('Mantenimiento correctivo 18 000 BTU', 'Diagnóstico y solución de fallas para que el equipo funcione al 100%. No incluye repuestos.', 190.00, 0, 'SERVICIO', 18000, (SELECT id FROM tipo_servicio WHERE codigo = 'MANTENIMIENTO')),
('Mantenimiento correctivo 24 000 BTU', 'Diagnóstico y solución de fallas para que el equipo funcione al 100%. No incluye repuestos.', 220.00, 0, 'SERVICIO', 24000, (SELECT id FROM tipo_servicio WHERE codigo = 'MANTENIMIENTO')),
-- Mantenimiento integral (preventivo + correctivo)
('Mantenimiento integral 12 000 BTU', 'Preventivo + correctivo: limpieza profunda interior y exterior y optimización del consumo.', 220.00, 0, 'SERVICIO', 12000, (SELECT id FROM tipo_servicio WHERE codigo = 'MANTENIMIENTO')),
('Mantenimiento integral 18 000 BTU', 'Preventivo + correctivo: limpieza profunda interior y exterior y optimización del consumo.', 260.00, 0, 'SERVICIO', 18000, (SELECT id FROM tipo_servicio WHERE codigo = 'MANTENIMIENTO')),
('Mantenimiento integral 24 000 BTU', 'Preventivo + correctivo: limpieza profunda interior y exterior y optimización del consumo.', 300.00, 0, 'SERVICIO', 24000, (SELECT id FROM tipo_servicio WHERE codigo = 'MANTENIMIENTO')),
-- Reparación
('Diagnóstico técnico',                  'Visita técnica para identificar la falla. Se descuenta si se aprueba la reparación.', 80.00, 0, 'SERVICIO', NULL, (SELECT id FROM tipo_servicio WHERE codigo = 'REPARACION')),
('Recarga de gas R410A 12 000 BTU',      'Detección de fugas y recarga de refrigerante R410A.', 180.00, 0, 'SERVICIO', 12000, (SELECT id FROM tipo_servicio WHERE codigo = 'REPARACION')),
('Recarga de gas R410A 18 000 BTU',      'Detección de fugas y recarga de refrigerante R410A.', 220.00, 0, 'SERVICIO', 18000, (SELECT id FROM tipo_servicio WHERE codigo = 'REPARACION')),
('Recarga de gas R410A 24 000 BTU',      'Detección de fugas y recarga de refrigerante R410A.', 260.00, 0, 'SERVICIO', 24000, (SELECT id FROM tipo_servicio WHERE codigo = 'REPARACION')),
('Reparación de fallas eléctricas',      'Revisión y reparación de tarjeta, sensores y conexiones. No incluye repuestos.', 150.00, 0, 'SERVICIO', NULL, (SELECT id FROM tipo_servicio WHERE codigo = 'REPARACION')),
('Solución de drenaje y fugas de agua',  'Destape y corrección del drenaje para evitar goteras y humedad.', 120.00, 0, 'SERVICIO', NULL, (SELECT id FROM tipo_servicio WHERE codigo = 'REPARACION'));

-- ---------- Cotización de EJEMPLO (RF03 y RF04) ----------
-- Casa de 18 m2 en Los Olivos que necesita instalación:
-- equipo 12 000 BTU (1 250) + instalación (350 x 1.00) + traslado Lima Norte (30) = S/ 1 630
INSERT INTO cotizacion (codigo, tipo_servicio_id, tipo_cliente_id, zona_id, area_m2, btu_recomendado,
                        subtotal_equipos, subtotal_mano_obra, costo_traslado, total)
VALUES ('COT-2026-000001',
        (SELECT id FROM tipo_servicio WHERE codigo = 'INSTALACION'),
        (SELECT id FROM tipo_cliente  WHERE codigo = 'HOGAR'),
        (SELECT id FROM zona          WHERE nombre = 'Lima Norte'),
        18.00, 12000, 1250.00, 350.00, 30.00, 1630.00);

INSERT INTO detalle_cotizacion (cotizacion_id, producto_id, cantidad, precio_unitario, subtotal)
SELECT (SELECT id FROM cotizacion WHERE codigo = 'COT-2026-000001'), id, 1, precio, precio
FROM productos
WHERE nombre IN ('Aire acondicionado Gree Inverter 12 000 BTU/h', 'Instalación básica 12 000 BTU');
