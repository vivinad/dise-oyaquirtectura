import { RedSocial } from './red-social.model';

export interface EmpresaConfig {
  nombre: string;
  lema: string;
  claim: string;
}

export interface ContactoConfig {
  responsable: string;
  telefono: string;
  telefonoInternacional: string;
  telefonoVisible: string;
  horario: string;
  mensajeWhatsapp: string;
}

export interface UbicacionConfig {
  direccion: string;
  zoom: number;
}

export interface EnlacesDerivados {
  whatsapp: string;
  telefono: string;
  mapa: string;
  mapaEmbed: string;
}

export interface ConfigGlobal {
  empresa: EmpresaConfig;
  contacto: ContactoConfig;
  ubicacion: UbicacionConfig;
  redes: RedSocial[];
  enlaces: EnlacesDerivados;
}
