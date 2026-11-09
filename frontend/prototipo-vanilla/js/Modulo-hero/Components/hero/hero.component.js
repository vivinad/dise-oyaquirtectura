/* ==========================================================================
   hero.component.js — Aplica los datos de contacto en el hero (claim y
   enlace de WhatsApp).
   ========================================================================== */
(function (GF) {
  "use strict";

  function iniciar() {
    const hero = document.querySelector(".gf-hero");
    if (!hero) return;
    GF.Nucleo.EnlazarService.aplicar(hero);
  }

  GF.Components.HeroComponent = { iniciar };
})(window.GF);
