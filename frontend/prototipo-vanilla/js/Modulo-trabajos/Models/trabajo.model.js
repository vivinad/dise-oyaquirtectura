/* ==========================================================================
   trabajo.model.js — Forma de una ficha de la galería "02 — Trabajos".
   ========================================================================== */
(function (GF) {
  "use strict";

  /**
   * @typedef {Object} Trabajo
   * @property {string} imagen  Ruta dentro de frontend/assets/
   * @property {string} alt
   * @property {string} pie
   */

  /** @param {Trabajo} datos @returns {Trabajo} */
  function crear({ imagen, alt, pie }) {
    return { imagen, alt, pie };
  }

  GF.Models.Trabajo = { crear };
})(window.GF);
