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

  @ViewChild('menuOptions') menu: ElementRef;
  @Input() folders: any;
  @Output() folderEvent = new EventEmitter<Object>();

  ngOnInit(): void {
    this.expanded = true
  }

  clickout() {
    this.menuStatus = false;
    this.menu.nativeElement.style.display = 'none';
  }

  onRightClick(event: any, folder: string) {
    event.preventDefault();
    this.menuStatus = true;
    this.menu.nativeElement.style.display = 'block';
    this.menu.nativeElement.style.position = 'fixed';
    this.menu.nativeElement.style.top = event.clientY - 0 + 'px';
    this.menu.nativeElement.style.left = event.clientX - 10 + 'px';
  }

  folderEmitter (type: string, folder: string) {
    this.folderEvent.emit({
      type: type, folder: folder
    });
  }
}
