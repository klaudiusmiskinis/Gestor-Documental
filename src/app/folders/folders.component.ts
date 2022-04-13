import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { fadeIn, slideDownHideUp, slideIn } from '../config/animations.config';
import { followCursor } from 'tippy.js';

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
followCursor: true,
plugins: [followCursor],
    }
    this.tooltipLeft = {
      arrow: true,
      placement: 'left',
      animation: 'fade',
delay: [500, 0],
followCursor: true,
plugins: [followCursor],
    }
    this.tooltipBottom = {
      arrow: true,
      placement: 'bottom',
      animation: 'fade',
delay: [500, 0],
followCursor: true,
plugins: [followCursor],
    }
  }

  ngOnInit(): void {
    this.expanded = true
  }

  folderEmitter(type: string, folder: string) {
    this.folderEvent.emit({
      type: type, folder: folder
    });
  }
}
