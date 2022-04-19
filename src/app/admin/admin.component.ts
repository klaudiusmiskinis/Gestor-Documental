import { Component, OnInit } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public columnas: ColDef[] = [
    { headerName: "ID", filter: 'agNumberColumnFilter', sortable: true, field: "id" },
    { headerName: 'Nombre', filter: true, sortable: true, field: "name" },
    { headerName: 'Ruta', filter: true, sortable: true, field: "path" },
    { headerName: 'Ultima versión', sortable: true, field: "isLastVersion" },
    { headerName: 'Fecha Creado', filter: 'agDateColumnFilter', sortable: true, field: "createdDate" },
    { headerName: 'ID Padre', filter: true, sortable: true, field: "idParent" },
    { headerName: 'Eliminado', filter: true, sortable: true, field: "isRemoved" },
    { headerName: 'Fecha Eliminado', filter: 'agDateColumnFilter', sortable: true, field: "removedDate" },
    { headerName: 'Motivo', filter: true, sortable: true, field: "reason" },
  ];
  public datos: any
  public gridApi: any;

  constructor(private request: RequestService) { }

  async ngOnInit(): Promise<void> {
    this.datos = await this.request.getAllFiles()
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.sizeColumnsToFit();
  }
}
