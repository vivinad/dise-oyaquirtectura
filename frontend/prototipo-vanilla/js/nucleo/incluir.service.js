/* ==========================================================================
   incluir.service.js — Carga los parciales HTML de cada componente.

   index.html solo trae <div data-gf-incluir="Modulo-x/Components/y/y.component">.
   Este servicio busca esos marcadores, pide el .html por fetch() y lo pone
   en su lugar. Como usa fetch(), necesita que el sitio se sirva por
   http/https (Netlify, Vercel, o un servidor local); no funciona abriendo
   index.html con doble clic (file://), a diferencia del resto del sitio.
   ========================================================================== */
(function (GF) {
  "use strict";

  async function cargarUno(nodo) {
    const ruta = nodo.dataset.gfIncluir;
    try {
      const respuesta = await fetch(`js/${ruta}.html`);
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      nodo.outerHTML = await respuesta.text();
    } catch (error) {
      console.error(`GF: no se pudo incluir "${ruta}.html"`, error);
    }
  }

  /** Reemplaza todos los [data-gf-incluir] por su parcial. Hay que esperarlo
   *  (await) antes de encender los Components que pintan o leen ese DOM. */
  function cargarTodos() {
    const nodos = Array.from(document.querySelectorAll("[data-gf-incluir]"));
    return Promise.all(nodos.map(cargarUno));
  }

  GF.Nucleo.IncluirService = { cargarTodos };
})(window.GF);
