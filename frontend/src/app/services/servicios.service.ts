import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Servicio } from '../models/servicio.model';

/**
 * ServiciosService — Provee las tarjetas de "01 — Servicios".
 * Retorna observables reactivos para compatibilidad con llamadas HTTP a Spring Boot.
 */
@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private readonly servicios: Servicio[] = [
    {
      id: 1,
      titulo: 'Instalación',
      texto: 'Cálculo de capacidad, montaje de evaporadora y condensadora, tuberías, drenaje y puesta en marcha.'
    },
    {
      id: 2,
      titulo: 'Mantenimiento',
      texto: 'Preventivo y correctivo: limpieza de filtros y serpentines, niveles de gas, drenaje y revisión eléctrica.'
    },
    {
      id: 3,
      titulo: 'Reparación',
      texto: 'Diagnóstico de averías, fallas eléctricas, recarga de refrigerante, fugas y cambio de repuestos.'
    },
    {
      id: 4,
      titulo: 'Venta de equipos',
      texto: 'Equipos inverter de 12 000, 18 000 y 24 000 BTU/hr, con envío a todo el Perú e instalación disponible.'
    }
  ];

  getServicios(): Observable<Servicio[]> {
    return of(this.servicios);
  }
}
