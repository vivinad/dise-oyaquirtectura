import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CatalogoCotizador,
  CotizacionRequest,
  CotizacionResponse,
  ProductoCotizador,
  RecomendacionEquipo
} from '../models/cotizador.model';

/**
 * CotizadorService — consume la API pública /api/cotizador del backend Spring Boot.
 */
@Injectable({
  providedIn: 'root'
})
export class CotizadorService {
  private readonly baseUrl = `${environment.apiUrl}/cotizador`;

  constructor(private http: HttpClient) {}

  obtenerCatalogo(): Observable<CatalogoCotizador> {
    return this.http.get<CatalogoCotizador>(`${this.baseUrl}/catalogo`);
  }

  recomendarEquipo(areaM2: number): Observable<RecomendacionEquipo> {
    const params = new HttpParams().set('area', areaM2);
    return this.http.get<RecomendacionEquipo>(`${this.baseUrl}/recomendacion`, { params });
  }

  listarServicios(tipo: string, btu: number | null): Observable<ProductoCotizador[]> {
    let params = new HttpParams().set('tipo', tipo);
    if (btu) {
      params = params.set('btu', btu);
    }
    return this.http.get<ProductoCotizador[]>(`${this.baseUrl}/servicios`, { params });
  }

  calcular(request: CotizacionRequest): Observable<CotizacionResponse> {
    return this.http.post<CotizacionResponse>(`${this.baseUrl}/calcular`, request);
  }

  guardar(request: CotizacionRequest): Observable<CotizacionResponse> {
    return this.http.post<CotizacionResponse>(`${this.baseUrl}/cotizaciones`, request);
  }
}
