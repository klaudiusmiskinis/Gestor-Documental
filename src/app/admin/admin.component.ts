import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { RequestService } from '../services/request.service';
import { localeEs } from '../../assets/locale.es';
import { fadeInError } from '../config/animations.config';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [fadeInError]
})
export class AdminComponent implements OnInit, OnDestroy {
  public columnas: ColDef[] = [
    { headerName: "ID", filter: 'agNumberColumnFilter', sortable: true, field: "id", resizable: true },
    { headerName: 'Nombre', filter: 'agTextColumnFilter', sortable: true, field: "name", resizable: true },
    { headerName: 'Ruta', filter: 'agTextColumnFilter', sortable: true, field: "path", resizable: true },
    { headerName: 'Ultima versión', filter: 'agNumberColumnFilter', sortable: true, field: "isLastVersion" },
    { headerName: 'Fecha Creado', filter: 'agDateColumnFilter', sortable: true, field: "createdDate", resizable: true },
    { headerName: 'ID Padre', filter: 'agNumberColumnFilter', sortable: true, field: "idParent", resizable: true },
    { headerName: 'Eliminado', filter: 'agDateColumnFilter', sortable: true, field: "isRemoved", resizable: true },
    { headerName: 'Fecha Eliminado', filter: 'agDateColumnFilter', sortable: true, field: "removedDate", resizable: true },
    { headerName: 'Motivo', filter: 'agTextColumnFilter', sortable: true, field: "reason", resizable: true },
  ];
  public datos: any
  public gridApi: any;
  public gridOptions = {}
  public selected: any;

  constructor(private request: RequestService) { }

  async ngOnInit(): Promise<void> {
    this.setDatos();
    this.gridOptions = {
      localeTextFunc: (key: string, defaultValue: string) => localeEs[key] || defaultValue
    }
  }

  public ngOnDestroy() {
    this.gridApi.destroy();
  }

  async setDatos() {
    this.datos = await this.request.getAllFiles()
  }

  onGridReady(params: any) {
    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
    this.restartSize();
  }

  restartSize() {
    if (!this.gridApi) throw "gridApi doesn't exist"
    this.gridApi.sizeColumnsToFit();
  }

  onRowClicked(event) {
    this.selected = event.data;
  }
}