/* ==========================================================================
   trabajos.component.js — Pinta la galería "02 — Trabajos" y su tarjeta
   final de llamada a la acción.
   ========================================================================== */
(function (GF) {
  "use strict";

  const MARCAS =
    '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>';

  function iniciar() {
    const grid = document.querySelector("[data-gf-trabajos]");
    if (!grid) return;

    const cfg = GF.Services.ConfigService;

    const fichas = GF.Services.TrabajosService.lista.map(
      (t) => `
      <figure class="gf-trabajo">
        <div class="blueprint duotone">
          ${MARCAS}
          <img src="${t.imagen}" alt="${t.alt}" loading="lazy">
        </div>
        <figcaption>${t.pie}</figcaption>
      </figure>`
    );

    /* Última celda de la galería: llamada a la acción, no una foto */
    fichas.push(`
      <div class="blueprint gf-cta-card">
        ${MARCAS}
        <h3>¿Tienes un proyecto en obra o varios ambientes?</h3>
        <p>Visitamos el lugar, calculamos la carga térmica y te entregamos una propuesta por ambiente.</p>
        <a class="btn btn-primary btn-marca blueprint" href="${cfg.enlaces.whatsapp}" target="_blank" rel="noopener">
          ${MARCAS}
          Agendar visita
        </a>
      </div>`);

    grid.innerHTML = fichas.join("");
  }

  GF.Components.TrabajosComponent = { iniciar };
})(window.GF);
