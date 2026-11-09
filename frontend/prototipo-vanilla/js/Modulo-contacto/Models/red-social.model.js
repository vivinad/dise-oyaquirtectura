/* ==========================================================================
   red-social.model.js — Forma de un enlace de red social del pie de página.
   ========================================================================== */
(function (GF) {
  "use strict";

  /**
   * @typedef {Object} RedSocial
   * @property {string} nombre
   * @property {string} url
   */

  /** @param {RedSocial} datos @returns {RedSocial} */
  function crear({ nombre, url }) {
    return { nombre, url };
  }

  GF.Models.RedSocial = { crear };
})(window.GF);
