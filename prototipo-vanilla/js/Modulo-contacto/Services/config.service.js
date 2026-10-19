/* ==========================================================================
   config.service.js — Datos de contacto y enlaces derivados.

   Única fuente de verdad: cambiar el teléfono, la dirección o las redes
   AQUÍ los cambia en toda la web (cabecera, botones, modal, pie y mapa).
   ========================================================================== */
(function (GF) {
  "use strict";

  const { RedSocial } = GF.Models;

  const datos = {
    empresa: {
      nombre: "Global Frío",
      lema: "Frescura que te acompaña",
      claim: "Los mejores Especialistas en sistemas de HVAC",
    },

    contacto: {
      responsable: "Edgar Sabalu",
      telefono: "904209489",
      telefonoInternacional: "51904209489",
      horario: "Atención de lunes a sábado. Emergencias 24/7.",
      mensajeWhatsapp: "Hola Global Frío, quisiera una cotización de aire acondicionado.",
    },

    ubicacion: {
      direccion: "4VJ7+W28 K, Ventanilla 07061, Perú",
      zoom: 16,
    },

    redes: [
      RedSocial.crear({ nombre: "Facebook", url: "https://www.facebook.com/SYSFRIOSAB" }),
      RedSocial.crear({ nombre: "TikTok", url: "https://www.tiktok.com/@edgarsabalu01" }),
    ],
  };

  /* --- Enlaces y formatos derivados ---------------------------------------- */
  const { telefonoInternacional, mensajeWhatsapp, telefono } = datos.contacto;
  const direccionCodificada = encodeURIComponent(datos.ubicacion.direccion);

  datos.enlaces = {
    whatsapp: `https://wa.me/${telefonoInternacional}?text=${encodeURIComponent(mensajeWhatsapp)}`,
    telefono: `tel:+${telefonoInternacional}`,
    mapa: `https://www.google.com/maps/search/?api=1&query=${direccionCodificada}`,
    mapaEmbed: `https://maps.google.com/maps?q=${direccionCodificada}&z=${datos.ubicacion.zoom}&output=embed`,
  };

  /* 904209489 → 904 209 489 */
  datos.contacto.telefonoVisible = telefono.replace(/(\d{3})(?=\d)/g, "$1 ").trim();

  GF.Services.ConfigService = datos;
})(window.GF);
