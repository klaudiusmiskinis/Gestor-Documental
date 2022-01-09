import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { slideIn, fadeIn } from '../config/animations.config';

@Component({
  selector: 'folders',
  templateUrl: './folders.component.html',
  animations: [slideIn, fadeIn]
})

export class FoldersComponent implements OnInit {
  public expanded: Boolean;

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
