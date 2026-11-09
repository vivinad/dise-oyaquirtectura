/* ==========================================================================
   enlazar.service.js — Aplica los datos de ConfigService a los elementos
   [data-gf-texto] / [data-gf-enlace] de una raíz del DOM.

   Cada componente que tenga alguno de estos atributos en su propio .html
   (header, hero, footer, ubicación, modal) llama a esto con su propia
   raíz al iniciar. Vive en Nucleo por ser infraestructura compartida
   entre varios módulos, no lógica de un solo dominio.
   ========================================================================== */
(function (GF) {
  "use strict";

  const $$ = (sel, raiz) => Array.from(raiz.querySelectorAll(sel));

  function aplicar(raiz) {
    const cfg = GF.Services.ConfigService;

    const textos = {
      telefono: cfg.contacto.telefonoVisible,
      responsable: cfg.contacto.responsable,
      claim: cfg.empresa.claim,
      horario: cfg.contacto.horario,
      direccion: cfg.ubicacion.direccion,
      whatsappEtiqueta: `WhatsApp ${cfg.contacto.telefonoVisible}`,
    };

    $$("[data-gf-texto]", raiz).forEach((el) => {
      const valor = textos[el.dataset.gfTexto];
      if (valor) el.textContent = valor;
    });

    $$("[data-gf-enlace]", raiz).forEach((el) => {
      const url = cfg.enlaces[el.dataset.gfEnlace];
      if (!url) return;
      el.setAttribute(el.tagName === "IFRAME" ? "src" : "href", url);
    });
  }

  GF.Nucleo.EnlazarService = { aplicar };
})(window.GF);
