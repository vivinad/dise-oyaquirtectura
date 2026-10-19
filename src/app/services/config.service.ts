import { Injectable } from '@angular/core';
import { ConfigGlobal } from '../models/config.model';

/**
 * ConfigService — Única fuente de verdad de datos corporativos de Global Frío.
 * Provee teléfonos, enlaces directos a WhatsApp, Google Maps y redes sociales.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly config: ConfigGlobal;

  constructor() {
    const telefono = '904209489';
    const telefonoInternacional = '51904209489';
    const mensajeWhatsapp = 'Hola Global Frío, quisiera una cotización de aire acondicionado.';
    const direccion = '4VJ7+W28 K, Ventanilla 07061, Perú';
    const direccionCodificada = encodeURIComponent(direccion);
    const zoom = 16;

    this.config = {
      empresa: {
        nombre: 'Global Frío',
        lema: 'Frescura que te acompaña',
        claim: 'Los mejores Especialistas en sistemas de HVAC'
      },
      contacto: {
        responsable: 'Edgar Sabalu',
        telefono,
        telefonoInternacional,
        telefonoVisible: telefono.replace(/(\d{3})(?=\d)/g, '$1 ').trim(),
        horario: 'Atención de lunes a sábado. Emergencias 24/7.',
        mensajeWhatsapp
      },
      ubicacion: {
        direccion,
        zoom
      },
      redes: [
        { nombre: 'Facebook', url: 'https://www.facebook.com/SYSFRIOSAB' },
        { nombre: 'TikTok', url: 'https://www.tiktok.com/@edgarsabalu01' }
      ],
      enlaces: {
        whatsapp: `https://wa.me/${telefonoInternacional}?text=${encodeURIComponent(mensajeWhatsapp)}`,
        telefono: `tel:+${telefonoInternacional}`,
        mapa: `https://www.google.com/maps/search/?api=1&query=${direccionCodificada}`,
        mapaEmbed: `https://maps.google.com/maps?q=${direccionCodificada}&z=${zoom}&output=embed`
      }
    };
  }

  getConfig(): ConfigGlobal {
    return this.config;
  }

  get empresa() {
    return this.config.empresa;
  }

  get contacto() {
    return this.config.contacto;
  }

  get ubicacion() {
    return this.config.ubicacion;
  }

  get redes() {
    return this.config.redes;
  }

  get enlaces() {
    return this.config.enlaces;
  }
}
