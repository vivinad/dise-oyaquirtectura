import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '../../services/config.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})
export class UbicacionComponent {
  mapaEmbedUrl: SafeResourceUrl;

  constructor(
    public configService: ConfigService,
    private modalService: ModalService,
    private sanitizer: DomSanitizer
  ) {
    this.mapaEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.configService.enlaces.mapaEmbed
    );
  }

  abrirModal(): void {
    this.modalService.abrir();
  }
}
