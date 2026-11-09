import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * ModalService — Gestión reactiva del estado del modal de contacto en toda la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private visibleSubject = new BehaviorSubject<boolean>(false);
  public visible$: Observable<boolean> = this.visibleSubject.asObservable();

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

  alternar(): void {
    if (this.visibleSubject.value) {
      this.cerrar();
    } else {
      this.abrir();
    }
  }
}
