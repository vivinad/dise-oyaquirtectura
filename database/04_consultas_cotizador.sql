/* =====================================================================
   Global Frío - Script 04: consultas que usará el cotizador
   ---------------------------------------------------------------------
   Sirven para comprobar la lógica en SSMS antes de programarla en el
   backend (luego se escriben como JPQL parametrizado en los repositorios).
   ===================================================================== */
USE globalfrio_db;
GO

-- RF01: lista de equipos y servicios activos
SELECT id, categoria, nombre, descripcion, precio
FROM productos WHERE activo = 1
ORDER BY categoria, capacidad_btu, precio;

-- RF02: equipo recomendado según el tamaño del ambiente (ejemplo: 25 m²)
DECLARE @area NUMERIC(6,2) = 25;
SELECT TOP 1 id, nombre, capacidad_btu, area_max_m2, precio
FROM productos
WHERE categoria = 'EQUIPO' AND activo = 1 AND area_max_m2 >= @area
ORDER BY capacidad_btu;          -- si no devuelve filas (> 40 m²), se sugiere más de un equipo o visita técnica

-- Servicios disponibles para el tipo elegido en el paso 1 y la capacidad del equipo
DECLARE @tipo VARCHAR(20) = 'MANTENIMIENTO', @btu INT = 18000;
SELECT p.id, p.nombre, p.precio
FROM productos p JOIN tipo_servicio t ON t.id = p.tipo_servicio_id
WHERE t.codigo = @tipo AND p.activo = 1 AND (p.capacidad_btu = @btu OR p.capacidad_btu IS NULL);

-- RF03: precio estimado (ejemplo: negocio en Miraflores, mantenimiento preventivo de un equipo de 18 000 BTU)
SELECT p.nombre                                   AS servicio,
       p.precio                                   AS precio_base,
       c.factor_precio,
       CAST(p.precio * c.factor_precio AS NUMERIC(10,2)) AS mano_obra,
       z.costo_traslado,
       CAST(p.precio * c.factor_precio AS NUMERIC(10,2)) + z.costo_traslado AS total_estimado
FROM productos p, tipo_cliente c, zona z
WHERE p.nombre = 'Mantenimiento preventivo 18 000 BTU' AND c.codigo = 'NEGOCIO' AND z.nombre = 'Lima Moderna';

-- RF04 / RF05: cotización guardada con su detalle (datos para el archivo descargable)
SELECT c.codigo, c.fecha, ts.nombre AS servicio, tc.nombre AS tipo_cliente, z.nombre AS zona,
       p.nombre AS item, d.cantidad, d.precio_unitario, d.subtotal,
       c.subtotal_equipos, c.subtotal_mano_obra, c.costo_traslado, c.total
FROM cotizacion c
JOIN tipo_servicio ts ON ts.id = c.tipo_servicio_id
JOIN tipo_cliente  tc ON tc.id = c.tipo_cliente_id
JOIN zona          z  ON z.id  = c.zona_id
JOIN detalle_cotizacion d ON d.cotizacion_id = c.id
JOIN productos     p  ON p.id  = d.producto_id
WHERE c.codigo = 'COT-2026-000001';
