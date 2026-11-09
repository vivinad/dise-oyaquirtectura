import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * CotizadorModalService — Abre y cierra el modal del cotizador desde cualquier componente
 * (cabecera, hero, etc.).
 */
@Injectable({
  providedIn: 'root'
})
export class CotizadorModalService {
  private visibleSubject = new BehaviorSubject<boolean>(false);
  public visible$: Observable<boolean> = this.visibleSubject.asObservable();

  get visible(): boolean {
    return this.visibleSubject.value;
  }

  abrir(): void {
    this.visibleSubject.next(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  cerrar(): void {
    this.visibleSubject.next(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}
