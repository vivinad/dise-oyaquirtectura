import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  constructor(
    public configService: ConfigService,
    public modalService: ModalService
  ) {}

  abrirModalContacto(): void {
    this.modalService.abrir();
  }
}
