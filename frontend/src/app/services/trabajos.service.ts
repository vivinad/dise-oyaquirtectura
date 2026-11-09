import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Trabajo } from '../models/trabajo.model';

/**
 * TrabajosService — Galería de "02 — Trabajos".
 * Los datos vienen de la base de datos a través del backend: GET /api/contenido/trabajos
 */
@Injectable({
  providedIn: 'root'
})
export class TrabajosService {
  constructor(private api: ApiService) {}

  getTrabajos(): Observable<Trabajo[]> {
    return this.api.get<Trabajo[]>('contenido/trabajos').pipe(
      catchError(error => {
        console.error('No se pudo leer /api/contenido/trabajos. ¿Está encendido el backend?', error);
        return of([]);
      })
    );
  }
}
