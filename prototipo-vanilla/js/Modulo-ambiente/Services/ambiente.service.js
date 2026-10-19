/* ==========================================================================
   ambiente.service.js — Persistencia del ambiente claro / oscuro.
   ========================================================================== */
(function (GF) {
  "use strict";

  const CLAVE = "gf-ambiente";
  const POR_DEFECTO = "oscuro";

  function aplicar(valor) {
    document.documentElement.dataset.theme = valor;
  }

  function actual() {
    return document.documentElement.dataset.theme || POR_DEFECTO;
  }

  /** Restaura el ambiente guardado en la visita anterior, si hay uno. */
  function iniciar() {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) aplicar(guardado);
  }

  /** Alterna claro/oscuro y guarda la elección. @returns {string} el ambiente resultante */
  function alternar() {
    const nuevo = actual() === "oscuro" ? "claro" : "oscuro";
    aplicar(nuevo);
    localStorage.setItem(CLAVE, nuevo);
    return nuevo;
  }

  GF.Services.AmbienteService = { iniciar, alternar, actual };
})(window.GF);
