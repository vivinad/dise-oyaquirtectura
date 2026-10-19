/* ==========================================================================
   namespace.js — Raíz del "módulo" GF.

   Equivale al AppModule del sistema de la orquesta: aquí solo se declaran
   los espacios Models / Services / Components / Nucleo que los demás
   archivos van a rellenar. No hay bundler ni ES modules, así que el orden
   de los <script> en index.html es lo que reemplaza a los imports.

   Nucleo/ vive fuera de cualquier Modulo-*, igual que guards/ e
   interceptors/ en el frontend de la orquesta: es infraestructura
   compartida (aquí, el que carga los .html de cada componente), no un
   dominio de negocio.
   ========================================================================== */

window.GF = window.GF || {};
window.GF.Models = window.GF.Models || {};
window.GF.Services = window.GF.Services || {};
window.GF.Components = window.GF.Components || {};
window.GF.Nucleo = window.GF.Nucleo || {};
