/* ==========================================================================
   modal.component.js — Modal de contacto ("Llamar ahora" /
   "Programar mantenimiento").
   ========================================================================== */
(function (GF) {
  "use strict";

  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));

  function iniciar() {
    const modal = $("[data-gf-modal]");
    if (!modal) return;

    GF.Nucleo.EnlazarService.aplicar(modal);

    let ultimoFoco = null;

    function abrir() {
      ultimoFoco = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      const cerrarBtn = $(".gf-cerrar", modal);
      if (cerrarBtn) cerrarBtn.focus();
    }

    function cerrar() {
      modal.hidden = true;
      document.body.style.overflow = "";
      if (ultimoFoco) ultimoFoco.focus();
    }

    $$("[data-gf-abrir-modal]").forEach((b) => b.addEventListener("click", abrir));
    $$("[data-gf-cerrar-modal]").forEach((b) => b.addEventListener("click", cerrar));

    /* Clic en el fondo cierra; clic dentro del panel, no */
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrar();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) cerrar();
    });
  }

  GF.Components.ModalComponent = { iniciar };
})(window.GF);
