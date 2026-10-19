/* ==========================================================================
   trabajos.service.js — Fichas de la galería "02 — Trabajos".

   La foto de cada ficha va en frontend/assets/.
   ========================================================================== */
(function (GF) {
  "use strict";

  const { Trabajo } = GF.Models;

  GF.Services.TrabajosService = {
    lista: [
      Trabajo.crear({
        imagen: "assets/samsung-dvm.jpg",
        alt: "Puesta en marcha de un equipo Samsung DVM S2",
        pie: "Multi-split en oficina — Samsung DVM S2",
      }),
      Trabajo.crear({
        imagen: "assets/consultorio.jpg",
        alt: "Equipo instalado en un consultorio dental",
        pie: "Consultorio dental — split de pared",
      }),
      Trabajo.crear({
        imagen: "assets/sala-inverter.jpg",
        alt: "Equipo inverter instalado en una sala",
        pie: "Sala de estar — equipo inverter",
      }),
      Trabajo.crear({
        imagen: "assets/condensadora-gree.jpg",
        alt: "Condensadora Gree montada en soporte de pared",
        pie: "Condensadora sobre soporte — exterior",
      }),
      Trabajo.crear({
        imagen: "assets/control-gree.jpg",
        alt: "Control remoto marcando 16 grados tras la puesta en marcha",
        pie: "Prueba de enfriamiento a 16 °C",
      }),
    ],
  };
})(window.GF);
