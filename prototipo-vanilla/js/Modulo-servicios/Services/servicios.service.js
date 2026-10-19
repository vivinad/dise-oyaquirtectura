/* ==========================================================================
   servicios.service.js — Textos de las tarjetas de "01 — Servicios".

   Para agregar un servicio nuevo, basta con añadir un objeto más a la
   lista. No hay que tocar el HTML.
   ========================================================================== */
(function (GF) {
  "use strict";

  const { Servicio } = GF.Models;

  GF.Services.ServiciosService = {
    lista: [
      Servicio.crear({
        titulo: "Instalación",
        texto: "Cálculo de capacidad, montaje de evaporadora y condensadora, tuberías, drenaje y puesta en marcha.",
      }),
      Servicio.crear({
        titulo: "Mantenimiento",
        texto: "Preventivo y correctivo: limpieza de filtros y serpentines, niveles de gas, drenaje y revisión eléctrica.",
      }),
      Servicio.crear({
        titulo: "Reparación",
        texto: "Diagnóstico de averías, fallas eléctricas, recarga de refrigerante, fugas y cambio de repuestos.",
      }),
      Servicio.crear({
        titulo: "Venta de equipos",
        texto: "Equipos inverter de 12 000, 18 000 y 24 000 BTU/hr, con envío a todo el Perú e instalación disponible.",
      }),
    ],
  };
})(window.GF);
