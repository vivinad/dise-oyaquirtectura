import { Component, OnInit } from '@angular/core';
import { CotizadorService } from '../../services/cotizador.service';
import { ConfigService } from '../../services/config.service';
import {
  CatalogoCotizador,
  CotizacionRequest,
  CotizacionResponse,
  ItemCotizacion,
  OpcionCotizador,
  ProductoCotizador,
  RecomendacionEquipo
} from '../../models/cotizador.model';

/**
 * Cotizador web en 4 pasos:
 * 1) tipo de servicio, 2) tipo de lugar, 3) equipo y/o servicios + zona, 4) precio estimado.
 * El cliente puede descargar su cotización (PDF) y continuar por WhatsApp. No requiere registro.
 */
@Component({
  selector: 'app-cotizador',
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.scss']
})
export class CotizadorComponent implements OnInit {
  readonly pasos = ['Servicio', 'Lugar', 'Detalles', 'Precio'];
  readonly capacidades = [12000, 18000, 24000];

  paso = 1;
  cargando = false;
  error = '';

  catalogo: CatalogoCotizador | null = null;
  tipoServicio: OpcionCotizador | null = null;
  tipoCliente: OpcionCotizador | null = null;
  zonaId: number | null = null;

  // Instalación: área → equipo recomendado
  areaM2: number | null = null;
  recomendacion: RecomendacionEquipo | null = null;
  equipoId: number | null = null;
  cantidadEquipos = 1;

  // Servicios disponibles para el tipo y la capacidad
  capacidadBtu: number | null = null;
  servicios: ProductoCotizador[] = [];
  seleccionados = new Set<number>();

  resultado: CotizacionResponse | null = null;
  guardada: CotizacionResponse | null = null;

  constructor(
    private cotizadorService: CotizadorService,
    public configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo(): void {
    this.cargando = true;
    this.error = '';
    this.cotizadorService.obtenerCatalogo().subscribe({
      next: catalogo => {
        this.catalogo = catalogo;
        this.cargando = false;
      },
      error: () => this.mostrarError('No pudimos cargar el cotizador. Verifica que el servidor esté encendido.')
    });
  }

  // ------------------------------------------------------------ paso 1 y 2

  get esInstalacion(): boolean {
    return this.tipoServicio?.codigo === 'INSTALACION';
  }

  elegirServicio(opcion: OpcionCotizador): void {
    this.tipoServicio = opcion;
    this.reiniciarDetalles();
    this.paso = 2;
  }

  elegirCliente(opcion: OpcionCotizador): void {
    this.tipoCliente = opcion;
    this.paso = 3;
    if (!this.esInstalacion && this.servicios.length === 0) {
      this.cambiarCapacidad(null);
    }
  }

  // ------------------------------------------------------------ paso 3

  recomendar(): void {
    if (!this.areaM2 || this.areaM2 <= 0) {
      this.error = 'Ingresa el tamaño del ambiente en m².';
      return;
    }
    this.error = '';
    this.cotizadorService.recomendarEquipo(this.areaM2).subscribe({
      next: rec => {
        this.recomendacion = rec;
        if (rec.equipo) {
          this.seleccionarEquipo(rec.equipo);
        }
      },
      error: () => this.mostrarError('No pudimos calcular la recomendación.')
    });
  }

  seleccionarEquipo(equipo: ProductoCotizador): void {
    this.equipoId = equipo.id;
    this.cargarServicios(equipo.capacidadBtu, true);
  }

  cambiarCapacidad(btu: number | null): void {
    this.capacidadBtu = btu;
    this.cargarServicios(btu, false);
  }

  private cargarServicios(btu: number | null, seleccionarPrimero: boolean): void {
    if (!this.tipoServicio) {
      return;
    }
    this.cotizadorService.listarServicios(this.tipoServicio.codigo, btu).subscribe({
      next: servicios => {
        this.servicios = servicios;
        this.seleccionados.clear();
        if (seleccionarPrimero && servicios.length > 0) {
          this.seleccionados.add(servicios[0].id);
        }
      },
      error: () => this.mostrarError('No pudimos cargar los servicios.')
    });
  }

  alternarServicio(id: number): void {
    if (this.seleccionados.has(id)) {
      this.seleccionados.delete(id);
    } else {
      this.seleccionados.add(id);
    }
  }

  /** Precio que verá el cliente según su tipo de lugar (el cálculo final lo hace el backend). */
  precioServicio(servicio: ProductoCotizador): number {
    const factor = this.tipoCliente?.factorPrecio ?? 1;
    return Math.round(servicio.precio * factor * 100) / 100;
  }

  get items(): ItemCotizacion[] {
    const items: ItemCotizacion[] = [];
    if (this.esInstalacion && this.equipoId) {
      items.push({ productoId: this.equipoId, cantidad: this.cantidadEquipos });
    }
    this.seleccionados.forEach(id =>
      items.push({ productoId: id, cantidad: this.esInstalacion ? this.cantidadEquipos : 1 })
    );
    return items;
  }

  get puedeVerPrecio(): boolean {
    return !!this.zonaId && this.items.length > 0;
  }

  verPrecio(): void {
    if (!this.puedeVerPrecio) {
      return;
    }
    this.cargando = true;
    this.error = '';
    this.guardada = null;
    this.cotizadorService.calcular(this.armarSolicitud()).subscribe({
      next: resultado => {
        this.resultado = resultado;
        this.cargando = false;
        this.paso = 4;
      },
      error: err => this.mostrarError(err?.error?.message || 'No pudimos calcular el precio.')
    });
  }

  // ------------------------------------------------------------ paso 4

  descargarPdf(): void {
    this.asegurarGuardada(() => this.imprimir());
  }

  continuarWhatsapp(): void {
    if (this.guardada) {
      window.open(this.enlaceWhatsapp(this.guardada), '_blank', 'noopener');
      return;
    }
    // Se abre la pestaña de inmediato para que el navegador no la bloquee y se completa al guardar.
    const pestana = window.open('', '_blank');
    this.asegurarGuardada(guardada => {
      if (pestana) {
        pestana.location.href = this.enlaceWhatsapp(guardada);
      }
    }, () => pestana?.close());
  }

  nuevaCotizacion(): void {
    this.tipoServicio = null;
    this.tipoCliente = null;
    this.zonaId = null;
    this.reiniciarDetalles();
    this.paso = 1;
  }

  irAPaso(paso: number): void {
    if (paso < this.paso) {
      this.paso = paso;
    }
  }

  enlaceWhatsapp(c: CotizacionResponse): string {
    const mensaje =
      `Hola Global Frío, quiero concretar mi cotización ${c.codigo}: ` +
      `${c.tipoServicio} para ${c.tipoCliente} en ${c.zona}. ` +
      `Total estimado: S/ ${c.total.toFixed(2)}.`;
    return `https://wa.me/${this.configService.contacto.telefonoInternacional}?text=${encodeURIComponent(mensaje)}`;
  }

  // ------------------------------------------------------------ apoyo

  private asegurarGuardada(siguiente: (c: CotizacionResponse) => void, alFallar?: () => void): void {
    if (this.guardada) {
      siguiente(this.guardada);
      return;
    }
    this.cargando = true;
    this.cotizadorService.guardar(this.armarSolicitud()).subscribe({
      next: guardada => {
        this.guardada = guardada;
        this.resultado = guardada;
        this.cargando = false;
        siguiente(guardada);
      },
      error: err => {
        alFallar?.();
        this.mostrarError(err?.error?.message || 'No pudimos guardar la cotización.');
      }
    });
  }

  private imprimir(): void {
    const tituloOriginal = document.title;
    document.title = `Cotizacion-${this.guardada?.codigo ?? 'GlobalFrio'}`;
    setTimeout(() => {
      window.print();
      document.title = tituloOriginal;
    }, 150);
  }

  private armarSolicitud(): CotizacionRequest {
    return {
      tipoServicio: this.tipoServicio!.codigo,
      tipoCliente: this.tipoCliente!.codigo,
      zonaId: this.zonaId!,
      areaM2: this.esInstalacion ? this.areaM2 : null,
      items: this.items
    };
  }

  private reiniciarDetalles(): void {
    this.areaM2 = null;
    this.recomendacion = null;
    this.equipoId = null;
    this.cantidadEquipos = 1;
    this.capacidadBtu = null;
    this.servicios = [];
    this.seleccionados.clear();
    this.resultado = null;
    this.guardada = null;
    this.error = '';
  }

  private mostrarError(mensaje: string): void {
    this.cargando = false;
    this.error = mensaje;
  }
}
