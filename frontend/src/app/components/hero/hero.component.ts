import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { ModalService } from '../../services/modal.service';
import { CotizadorModalService } from '../../services/cotizador-modal.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  constructor(
    public configService: ConfigService,
    public modalService: ModalService,
    private cotizadorModal: CotizadorModalService
  ) {}

  abrirCotizador(): void {
    this.cotizadorModal.abrir();
  }

  abrirModalContacto(): void {
    this.modalService.abrir();
  }
}
