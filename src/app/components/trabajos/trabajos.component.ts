import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TrabajosService } from '../../services/trabajos.service';
import { ConfigService } from '../../services/config.service';
import { Trabajo } from '../../models/trabajo.model';

@Component({
  selector: 'app-trabajos',
  templateUrl: './trabajos.component.html',
  styleUrls: ['./trabajos.component.scss']
})
export class TrabajosComponent implements OnInit {
  trabajos$!: Observable<Trabajo[]>;

  constructor(
    private trabajosService: TrabajosService,
    public configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.trabajos$ = this.trabajosService.getTrabajos();
  }
}
