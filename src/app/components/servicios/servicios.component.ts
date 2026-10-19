import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiciosService } from '../../services/servicios.service';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicios$!: Observable<Servicio[]>;

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.servicios$ = this.serviciosService.getServicios();
  }

  formatearNumero(indice: number): string {
    return `/${String(indice + 1).padStart(2, '0')}`;
  }
}
