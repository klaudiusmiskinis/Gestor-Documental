import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { slideIn } from '../models/animations.config';

@Component({
  selector: 'folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css'],
  animations: [slideIn]
})

export class FoldersComponent implements OnInit {

  public expanded: Boolean;

  constructor() { 
    this.expanded = false;
  }

  @Input() folders: any;
  @Output() folderEvent = new EventEmitter<Object>();

  ngOnInit(): void {
  }

  folderEmitter (type: string, folder: string) {
    this.folderEvent.emit({type: type, folder: folder});
  }
}
