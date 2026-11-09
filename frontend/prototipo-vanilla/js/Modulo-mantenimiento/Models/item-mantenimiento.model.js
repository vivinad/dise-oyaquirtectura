/* ==========================================================================
   item-mantenimiento.model.js — Forma de un punto del checklist de
   "03 — Mantenimiento".
   ========================================================================== */
(function (GF) {
  "use strict";

  /**
   * @typedef {Object} ItemMantenimiento
   * @property {string} titulo
   * @property {string} texto
   */

  /** @param {ItemMantenimiento} datos @returns {ItemMantenimiento} */
  function crear({ titulo, texto }) {
    return { titulo, texto };
  }

  GF.Models.ItemMantenimiento = { crear };
})(window.GF);
