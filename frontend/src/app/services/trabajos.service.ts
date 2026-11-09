import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Trabajo } from '../models/trabajo.model';

/**
 * TrabajosService — Galería de proyectos e instalaciones recientes de "02 — Trabajos".
 */
@Injectable({
  providedIn: 'root'
})
export class TrabajosService {
  private readonly trabajos: Trabajo[] = [
    {
      id: 1,
      imagen: 'assets/samsung-dvm.jpg',
      alt: 'Puesta en marcha de un equipo Samsung DVM S2',
      pie: 'Multi-split en oficina — Samsung DVM S2'
    },
    {
      id: 2,
      imagen: 'assets/consultorio.jpg',
      alt: 'Equipo instalado en un consultorio dental',
      pie: 'Consultorio dental — split de pared'
    },
    {
      id: 3,
      imagen: 'assets/sala-inverter.jpg',
      alt: 'Equipo inverter instalado en una sala',
      pie: 'Sala de estar — equipo inverter'
    },
    {
      id: 4,
      imagen: 'assets/condensadora-gree.jpg',
      alt: 'Condensadora Gree montada en soporte de pared',
      pie: 'Condensadora sobre soporte — exterior'
    },
    {
      id: 5,
      imagen: 'assets/control-gree.jpg',
      alt: 'Control remoto marcando 16 grados tras la puesta en marcha',
      pie: 'Prueba de enfriamiento a 16 °C'
    }
  ];

  getTrabajos(): Observable<Trabajo[]> {
    return of(this.trabajos);
  }
}
