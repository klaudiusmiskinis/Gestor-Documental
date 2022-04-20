import { Component, OnInit } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { RequestService } from '../services/request.service';
import { localeEs } from '../../assets/locale.es';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

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
  public gridOptions = {};

  constructor(private request: RequestService) { }

  async ngOnInit(): Promise<void> {
    this.datos = await this.request.getAllFiles()
    this.gridOptions = {
      localeTextFunc: (key: string, defaultValue: string) => localeEs[key] || defaultValue
    }
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
    this.gridApi.sizeColumnsToFit();
  }
}
