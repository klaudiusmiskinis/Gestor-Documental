import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @Input() expanded: boolean;
  @Input() folders: any;
  @Output() folderEvent = new EventEmitter<Object>();

  constructor() {
    this.menuStatus = false;
    this.tooltipRight = {
      arrow: true,
      placement: 'right',
      animation: 'fade',
    }
    this.tooltipLeft = {
      arrow: true,
      placement: 'left',
      animation: 'fade',
    }
    this.tooltipBottom = {
      arrow: true,
      placement: 'bottom',
      animation: 'fade',
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
