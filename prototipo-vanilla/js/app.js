/* ==========================================================================
   app.js — Arranque de la página (equivalente al bootstrap de AppModule).

   Primero incluye el HTML de cada componente (Nucleo), y recién entonces
   enciende los componentes que leen o pintan ese DOM. El trabajo real vive
   en Models/, Services/ y Components/ de cada Modulo-*.
   ========================================================================== */
(function (GF) {
  "use strict";

  document.addEventListener("DOMContentLoaded", async function iniciar() {
    await GF.Nucleo.IncluirService.cargarTodos();

    GF.Components.HeaderComponent.iniciar();
    GF.Components.HeroComponent.iniciar();
    GF.Components.ServiciosComponent.iniciar();
    GF.Components.TrabajosComponent.iniciar();
    GF.Components.MantenimientoComponent.iniciar();
    GF.Components.UbicacionComponent.iniciar();
    GF.Components.FooterComponent.iniciar();
    GF.Components.ModalComponent.iniciar();
    GF.Components.AmbienteComponent.iniciar();
  });
})(window.GF);
