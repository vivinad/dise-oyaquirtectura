/** Modelos del cotizador (espejo de los DTO del backend /api/cotizador). */

export interface OpcionCotizador {
  codigo: string;
  nombre: string;
  descripcion: string;
  factorPrecio: number | null;
}

export interface Zona {
  id: number;
  nombre: string;
  distritos: string;
  costoTraslado: number;
}

export interface ProductoCotizador {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: 'EQUIPO' | 'SERVICIO';
  capacidadBtu: number | null;
  areaMaxM2: number | null;
  tipoServicio: string | null;
}

export interface CatalogoCotizador {
  tiposServicio: OpcionCotizador[];
  tiposCliente: OpcionCotizador[];
  zonas: Zona[];
  equipos: ProductoCotizador[];
}

export interface RecomendacionEquipo {
  areaM2: number;
  equipo: ProductoCotizador | null;
  mensaje: string;
}

export interface ItemCotizacion {
  productoId: number;
  cantidad: number;
}

export interface CotizacionRequest {
  tipoServicio: string;
  tipoCliente: string;
  zonaId: number;
  areaM2: number | null;
  items: ItemCotizacion[];
}

export interface LineaCotizacion {
  productoId: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CotizacionResponse {
  codigo: string | null;
  fecha: string | null;
  tipoServicio: string;
  tipoCliente: string;
  factorPrecio: number;
  zona: string;
  areaM2: number | null;
  btuRecomendado: number | null;
  lineas: LineaCotizacion[];
  subtotalEquipos: number;
  subtotalManoObra: number;
  costoTraslado: number;
  total: number;
}
