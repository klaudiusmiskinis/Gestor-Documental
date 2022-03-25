import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'item',
  templateUrl: './item-box.component.html',
  styleUrls: ['./item-box.component.css']
})
export class ItemBoxComponent implements OnInit{
  @Input() isFolder: boolean;
  @Input() isFile: boolean;
  @Input() buttons: number;
  @Input() name: string;

  ngOnInit() {
    if (!this.buttons) {
      if (this.isFile) {
        this.buttons = 0
      }

      if (this.isFolder) {
        this.buttons = 2
      }
    }
  }
}
