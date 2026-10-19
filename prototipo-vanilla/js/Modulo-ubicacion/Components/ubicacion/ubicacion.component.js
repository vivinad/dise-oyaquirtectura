/* ==========================================================================
   ubicacion.component.js — Aplica los datos de contacto en la sección
   "04 — Ubicación" (dirección, responsable, teléfono, mapa).
   ========================================================================== */
(function (GF) {
  "use strict";

  function iniciar() {
    const seccion = document.querySelector("#ubicacion");
    if (!seccion) return;
    GF.Nucleo.EnlazarService.aplicar(seccion);
  }

  GF.Components.UbicacionComponent = { iniciar };
})(window.GF);
