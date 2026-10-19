/* ==========================================================================
   header.component.js — Aplica los datos de contacto en la cabecera
   (etiqueta y enlace de WhatsApp).
   ========================================================================== */
(function (GF) {
  "use strict";

  function iniciar() {
    const header = document.querySelector(".gf-header");
    if (!header) return;
    GF.Nucleo.EnlazarService.aplicar(header);
  }

  GF.Components.HeaderComponent = { iniciar };
})(window.GF);
