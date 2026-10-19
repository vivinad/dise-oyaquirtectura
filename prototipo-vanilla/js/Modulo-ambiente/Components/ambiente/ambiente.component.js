/* ==========================================================================
   ambiente.component.js — Botón opcional de cambio claro / oscuro.

   Para ofrecerlo al visitante basta con añadir un botón con el atributo
   data-gf-ambiente en el HTML; este componente ya lo escucha.
   ========================================================================== */
(function (GF) {
  "use strict";

  function iniciar() {
    GF.Services.AmbienteService.iniciar();

    const boton = document.querySelector("[data-gf-ambiente]");
    if (!boton) return;

    boton.addEventListener("click", () => GF.Services.AmbienteService.alternar());
  }

  GF.Components.AmbienteComponent = { iniciar };
})(window.GF);
