/* ==========================================================================
   servicio.model.js — Forma de una tarjeta de "01 — Servicios".
   ========================================================================== */
(function (GF) {
  "use strict";

  /**
   * @typedef {Object} Servicio
   * @property {string} titulo
   * @property {string} texto
   */

  /** @param {Servicio} datos @returns {Servicio} */
  function crear({ titulo, texto }) {
    return { titulo, texto };
  }

  GF.Models.Servicio = { crear };
})(window.GF);
