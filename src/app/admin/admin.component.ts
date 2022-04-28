import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { RequestService } from '../services/request.service';
import { localeEs } from '../../assets/locale.es';
import { fadeInError } from '../config/animations.config';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../validators/CustomValidators';
declare var $: any;

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
  public editRowForm: FormGroup;

  constructor(private request: RequestService) {
    this.editRowForm = new FormGroup({
      id: new FormControl({ value: 'id', disabled: true }),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('^[A-zÀ-ú]*$')
      ]),
      path: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('^[A-zÀ-ú]/*$')
      ]),
      isLastVersion: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(1),
        CustomValidator.numeric
      ])
    })
  }


  async ngOnInit(): Promise<void> {
    this.setDatos();
    this.gridOptions = {
      localeTextFunc: (key: string, defaultValue: string) => localeEs[key] || defaultValue
    }
  }

  public ngOnDestroy() {
    this.gridApi.destroy();
  }

  setFormValues() {
    const controls = this.editRowForm.controls;
    if (!controls) throw 'Error with the form data';
    if (this.selected) {
      controls['id'].setValue(this.selected.id);
      controls['name'].setValue(this.selected.name);
      controls['path'].setValue(this.selected.path);
      controls['isLastVersion'].setValue(this.selected.isLastVersion);
    }
  }

  async setDatos() {
    this.datos = await this.request.getAllFiles()
  }

  onGridReady(params: any) {
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
    this.setFormValues();
  }

  editRowSubmit() {
    console.log('Submit');
  }

  modal(id: string, state: string): void {
    $('#' + id).modal(state);
  }
}