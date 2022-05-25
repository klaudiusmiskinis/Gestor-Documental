import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeIn, slideIn } from '../config/animations.config';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'files',
  templateUrl: './files.component.html',
  animations: [slideIn, fadeIn]
})

export class FilesComponent {
  public tooltipRight: object;
  public tooltipLeft: object;
  constructor(private request: RequestService) {
    this.tooltipRight = {
      arrow: true,
      placement: 'right',
      animation: 'fade',
      delay: [500, 0],
    }
    this.tooltipLeft = {
      arrow: true,
      placement: 'left',
      animation: 'fade',
      delay: [500, 0],
    }
  }
  @Input() isAdmin: boolean;
  @Input() files: any;
  @Input() path: string;
  @Output() fileEvent = new EventEmitter<Object>();

  /**
   * Maneja la url para devolver un archivo para descargar
   * @param file string
   * @returns string
   */
  getFile(file: string): string {
    return this.request.getFile(this.path, file);
  };

  /**
   * Maneja la url para devolver un archivo para descargar
   * @param file string
   * @returns string
   */
  getFilePDF(file: string): string {
    return this.request.getPDF(this.path, file);
  };

  /**
   * Emisor de output para componentes padres
   * @param type string
   * @param file string
   */
  fileEmitter(type: string, file: string) {
    this.fileEvent.emit({ type: type, file: file });
  }

  /**
   * Comprueba si la extension es .docx
   * @param filename string
   * @returns boolean
   */
  isDocx(filename: string) {
    if (!filename.includes('.')) throw "Extension not detected";
    if (filename.includes('.docx')) return true;
    return false;
  }
}
