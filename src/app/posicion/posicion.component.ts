import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'posicion',
  templateUrl: './posicion.component.html',
  styleUrls:  ['./posicion.component.css']
})

export class PosicionComponent implements OnInit {

  @Input() path: string; 
  items: MenuItem[] = [];
  home: Object;

    ngOnInit() {
      this.items = [];
      this.home = {icon: 'pi pi-folder-open'};
    }

    ngOnChanges() {
      this.items = [];
      this.splitRoutes(this.path);
    }

    splitRoutes(pathToSplit: string) {
      const path = pathToSplit.split('?path=');
      let subDirectories: string[];
      if (path.length > 1) {
        subDirectories = path[path.length - 1].split('/');
        subDirectories.forEach(sub => {
          this.items.push({
            label: sub
          })
        });
      };
    };

};
