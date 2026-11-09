import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { ModalService } from '../../services/modal.service';
import { ItemMantenimiento } from '../../models/item-mantenimiento.model';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.scss']
})
export class MantenimientoComponent implements OnInit {
  items$!: Observable<ItemMantenimiento[]>;

  constructor(
    private mantenimientoService: MantenimientoService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.items$ = this.mantenimientoService.getItems();
  }

  abrirModal(): void {
    this.modalService.abrir();
  }
}
