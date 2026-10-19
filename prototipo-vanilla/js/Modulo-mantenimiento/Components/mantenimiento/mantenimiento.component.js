/* ==========================================================================
   mantenimiento.component.js — Pinta el checklist de "03 — Mantenimiento".
   ========================================================================== */
(function (GF) {
  "use strict";

  function iniciar() {
    const grid = document.querySelector("[data-gf-mantenimiento]");
    if (!grid) return;

    grid.innerHTML = GF.Services.MantenimientoService.lista
      .map((p) => `<div><h4>${p.titulo}</h4><p>${p.texto}</p></div>`)
      .join("");
  }

  GF.Components.MantenimientoComponent = { iniciar };
})(window.GF);
