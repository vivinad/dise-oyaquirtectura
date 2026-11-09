/* ==========================================================================
   mantenimiento.service.js — Checklist de "03 — Mantenimiento".
   ========================================================================== */
(function (GF) {
  "use strict";

  const { ItemMantenimiento } = GF.Models;

  GF.Services.MantenimientoService = {
    lista: [
      ItemMantenimiento.crear({
        titulo: "Limpieza profunda",
        texto: "Filtros, rejillas, evaporador y condensador, interior y exterior.",
      }),
      ItemMantenimiento.crear({
        titulo: "Niveles de gas",
        texto: "Revisión de refrigerante, detección de fugas y recarga si corresponde.",
      }),
      ItemMantenimiento.crear({
        titulo: "Drenaje y tuberías",
        texto: "Verificación del desagüe para evitar goteras y humedad en la pared.",
      }),
      ItemMantenimiento.crear({
        titulo: "Pruebas finales",
        texto: "Revisión eléctrica y prueba de rendimiento antes de entregar el equipo.",
      }),
    ],
  };
})(window.GF);
