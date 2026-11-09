export interface Servicio {
  id?: number;
  titulo: string;
  texto: string;
  /** Nombre del ícono de Material Icons, guardado en la base de datos. */
  icono?: string;
}
