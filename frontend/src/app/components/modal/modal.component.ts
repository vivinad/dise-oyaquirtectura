import { Component, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '../../services/config.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  mapaEmbedUrl: SafeResourceUrl;

  constructor(
    public configService: ConfigService,
    public modalService: ModalService,
    private sanitizer: DomSanitizer
  ) {
    this.mapaEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.configService.enlaces.mapaEmbed
    );
  }

  cerrar(): void {
    this.modalService.cerrar();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('gf-modal')) {
      this.cerrar();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(): void {
    this.cerrar();
  }
}
