import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Servicio } from '../models/servicio.model';

/**
 * ServiciosService — Tarjetas de "01 — Servicios".
 * Los datos vienen de la base de datos a través del backend: GET /api/contenido/servicios
 */
@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  constructor(private api: ApiService) {}

  getServicios(): Observable<Servicio[]> {
    return this.api.get<Servicio[]>('contenido/servicios').pipe(
      catchError(error => {
        console.error('No se pudo leer /api/contenido/servicios. ¿Está encendido el backend?', error);
        return of([]);
      })
    );
  }
}
