import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ItemMantenimiento } from '../models/item-mantenimiento.model';

/**
 * MantenimientoService — Lo que incluye el mantenimiento en "03 — Mantenimiento".
 * Los datos vienen de la base de datos a través del backend: GET /api/contenido/mantenimiento
 */
@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  constructor(private api: ApiService) {}

  getItems(): Observable<ItemMantenimiento[]> {
    return this.api.get<ItemMantenimiento[]>('contenido/mantenimiento').pipe(
      catchError(error => {
        console.error('No se pudo leer /api/contenido/mantenimiento. ¿Está encendido el backend?', error);
        return of([]);
      })
    );
  }
}
