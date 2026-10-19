/* ==========================================================================
   footer.component.js — Aplica los datos de contacto en el pie (dirección,
   enlace al mapa) y arma la lista de redes sociales.
   ========================================================================== */
(function (GF) {
  "use strict";

  function iniciar() {
    const footer = document.querySelector(".gf-footer");
    if (!footer) return;

    GF.Nucleo.EnlazarService.aplicar(footer);

    const cfg = GF.Services.ConfigService;
    const redes = footer.querySelector("[data-gf-redes]");
    if (redes) {
      const enlaces = cfg.redes.map(
        (r) => `<a href="${r.url}" target="_blank" rel="noopener">${r.nombre}</a>`
      );
      enlaces.push(
        `<a href="${cfg.enlaces.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`
      );
      redes.innerHTML = enlaces.join("");
    }
  }

  GF.Components.FooterComponent = { iniciar };
})(window.GF);
