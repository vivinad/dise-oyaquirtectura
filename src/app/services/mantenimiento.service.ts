import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ItemMantenimiento } from '../models/item-mantenimiento.model';

/**
 * MantenimientoService — Checklist técnico de "03 — Mantenimiento".
 */
@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  private readonly items: ItemMantenimiento[] = [
    {
      id: 1,
      titulo: 'Limpieza profunda',
      texto: 'Filtros, rejillas, evaporador y condensador, interior y exterior.'
    },
    {
      id: 2,
      titulo: 'Niveles de gas',
      texto: 'Revisión de refrigerante, detección de fugas y recarga si corresponde.'
    },
    {
      id: 3,
      titulo: 'Drenaje y tuberías',
      texto: 'Verificación del desagüe para evitar goteras y humedad en la pared.'
    },
    {
      id: 4,
      titulo: 'Pruebas finales',
      texto: 'Revisión eléctrica y prueba de rendimiento antes de entregar el equipo.'
    }
  ];

  getItems(): Observable<ItemMantenimiento[]> {
    return of(this.items);
  }
}
