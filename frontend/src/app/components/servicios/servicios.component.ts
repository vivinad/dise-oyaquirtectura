import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiciosService } from '../../services/servicios.service';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  servicios$!: Observable<Servicio[]>;

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.servicios$ = this.serviciosService.getServicios();
  }

  /** Íconos de respaldo, por si un servicio de la base de datos no trae ícono. */
  readonly iconos = ['construction', 'cleaning_services', 'handyman', 'ac_unit'];

  icono(indice: number): string {
    return this.iconos[indice] ?? 'ac_unit';
  }

  formatearNumero(indice: number): string {
    return `/${String(indice + 1).padStart(2, '0')}`;
  }
}
