import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type TemaAmbiente = 'oscuro' | 'claro';

/**
 * AmbienteService — Control reactivo del tema claro / oscuro con persistencia en localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class AmbienteService {
  private readonly CLAVE_STORAGE = 'gf-ambiente';
  private readonly TEMA_POR_DEFECTO: TemaAmbiente = 'oscuro';

  private temaSubject = new BehaviorSubject<TemaAmbiente>(this.obtenerTemaInicial());
  public tema$: Observable<TemaAmbiente> = this.temaSubject.asObservable();

  constructor() {
    this.aplicarTema(this.temaSubject.value);
  }

  private obtenerTemaInicial(): TemaAmbiente {
    const guardado = localStorage.getItem(this.CLAVE_STORAGE) as TemaAmbiente;
    if (guardado === 'claro' || guardado === 'oscuro') {
      return guardado;
    }
    return this.TEMA_POR_DEFECTO;
  }

  public get temaActual(): TemaAmbiente {
    return this.temaSubject.value;
  }

  public alternar(): TemaAmbiente {
    const nuevoTema: TemaAmbiente = this.temaSubject.value === 'oscuro' ? 'claro' : 'oscuro';
    this.aplicarTema(nuevoTema);
    localStorage.setItem(this.CLAVE_STORAGE, nuevoTema);
    this.temaSubject.next(nuevoTema);
    return nuevoTema;
  }

  public establecerTema(tema: TemaAmbiente): void {
    this.aplicarTema(tema);
    localStorage.setItem(this.CLAVE_STORAGE, tema);
    this.temaSubject.next(tema);
  }

  private aplicarTema(tema: TemaAmbiente): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', tema);
    }
  }
}
