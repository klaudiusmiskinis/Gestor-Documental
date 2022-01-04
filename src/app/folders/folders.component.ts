import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css']
})

export class FoldersComponent implements OnInit {

  constructor() { }

  @Input() folders: any;
  @Output() folderEvent = new EventEmitter<Object>();

  ngOnInit(): void {
  }

  folderEmitter (type: string, folder: string) {
    this.folderEvent.emit({type: type, folder: folder});
  }
}
