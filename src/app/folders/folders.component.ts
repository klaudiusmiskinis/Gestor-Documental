import { Component, ElementRef, EventEmitter, Host, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { right } from '@popperjs/core';
import { slideIn, fadeIn } from '../config/animations.config';

@Component({
  selector: 'folders',
  templateUrl: './folders.component.html',
  animations: [slideIn, fadeIn]
})

export class FoldersComponent implements OnInit {
  public expanded: Boolean;
  public tooltip: object;
  public menuStatus: boolean;

  constructor() {
    this.menuStatus = false;
    this.tooltip = {
      arrow: false,
      placement: 'top'
    }
  }

  @Input() folders: any;
  @Output() folderEvent = new EventEmitter<Object>();

  ngOnInit(): void {
    this.expanded = true
  }

  folderEmitter (type: string, folder: string) {
    this.folderEvent.emit({
      type: type, folder: folder
    });
  }
}
