import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { AmbienteService, TemaAmbiente } from '../../services/ambiente.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    public configService: ConfigService,
    public ambienteService: AmbienteService
  ) {}

  get whatsappEtiqueta(): string {
    return `WhatsApp ${this.configService.contacto.telefonoVisible}`;
  }

  get whatsappEnlace(): string {
    return this.configService.enlaces.whatsapp;
  }

  get temaActual(): TemaAmbiente {
    return this.ambienteService.temaActual;
  }

  alternarTema(): void {
    this.ambienteService.alternar();
  }
}
