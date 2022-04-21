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
    { headerName: 'Nombre', filter: 'agTextColumnFilter', sortable: true, field: "name", resizable: true, editable: true },
    { headerName: 'Ruta', filter: 'agTextColumnFilter', sortable: true, field: "path", resizable: true, editable: true },
    { headerName: 'Ultima versión', filter: 'agNumberColumnFilter', sortable: true, field: "isLastVersion", editable: true },
    { headerName: 'Fecha Creado', filter: 'agDateColumnFilter', sortable: true, field: "createdDate", resizable: true, editable: true },
    { headerName: 'ID Padre', filter: 'agNumberColumnFilter', sortable: true, field: "idParent", resizable: true, editable: true },
    { headerName: 'Eliminado', filter: 'agDateColumnFilter', sortable: true, field: "isRemoved", resizable: true, editable: true },
    { headerName: 'Fecha Eliminado', filter: 'agDateColumnFilter', sortable: true, field: "removedDate", resizable: true, editable: true },
    { headerName: 'Motivo', filter: 'agTextColumnFilter', sortable: true, field: "reason", resizable: true, editable: true },
  ];
  public datos: any
  public gridApi: any;
  public gridOptions = {}
  public rowsOnDisplay: number = 20;

  constructor(private request: RequestService) { }

  async ngOnInit(): Promise<void> {
    this.setDatos();
    this.gridOptions = {
      localeTextFunc: (key: string, defaultValue: string) => localeEs[key] || defaultValue
    }
  }

  ngOnDestroy(): void {
    if (!this.gridApi) throw "gridApi doesn't exist"
    this.gridApi.destroy();
  }

  async setDatos() {
    this.datos = await this.request.getAllFiles()
  }

  setRowsOnDisplay(rows: string) {
    this.rowsOnDisplay = Number(rows);
    this.gridApi.paginationSetPageSize(this.rowsOnDisplay);
    this.request.notificate('Mostrando ' + rows + ' filas');
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

  onCellEditingStarted(event) {
    const oldCellValue = event.value;
    console.log('cellEditingStarted', oldCellValue);
  }

  onCellEditingStopped(event) {
    const editedCellValue = event.value;
    console.log('cellEditingStopped', editedCellValue);
  }
}