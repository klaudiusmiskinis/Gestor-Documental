import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { fadeIn, slideDownHideUp, slideIn } from '../config/animations.config';

@Component({
  selector: 'folders',
  templateUrl: './folders.component.html',
  animations: [fadeIn, slideDownHideUp, slideIn]
})

export class FoldersComponent implements OnInit {
  public tooltipRight: object;
  public tooltipLeft: object;
  public tooltipBottom: object;
  public menuStatus: boolean;
  @Input() isAdmin: boolean;
  @Input() expanded: boolean;
  @Input() folders: any;
  @Output() folderEvent = new EventEmitter<Object>();

  constructor() {
    this.menuStatus = false;
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
    this.tooltipBottom = {
      arrow: true,
      placement: 'bottom',
      animation: 'fade',
      delay: [500, 0],
    }
  }

  /**
   * Método para cuando el componente cargue.
   */
  ngOnInit(): void {
    this.expanded = true
  }

  /**
   * Emisor de output para componentes padres
   * @param type string
   * @param folder string
   */
  folderEmitter(type: string, folder: string) {
    this.folderEvent.emit({
      type: type, folder: folder
    });
  }
}
