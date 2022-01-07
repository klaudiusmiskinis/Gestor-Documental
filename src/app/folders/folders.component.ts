import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { slideIn, fadeIn } from '../models/animations.config';

@Component({
  selector: 'folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css'],
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
