/* ==========================================================================
   servicios.component.js — Pinta la sección "01 — Servicios".
   ========================================================================== */
(function (GF) {
  "use strict";

  const MARCAS =
    '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>';

  function iniciar() {
    const grid = document.querySelector("[data-gf-servicios]");
    if (!grid) return;

    grid.innerHTML = GF.Services.ServiciosService.lista
      .map(
        (s, i) => `
        <article class="card blueprint gf-servicio">
          ${MARCAS}
          <div class="gf-servicio__num">/${String(i + 1).padStart(2, "0")}</div>
          <h3>${s.titulo}</h3>
          <p>${s.texto}</p>
        </article>`
      )
      .join("");
  }

  GF.Components.ServiciosComponent = { iniciar };
})(window.GF);
