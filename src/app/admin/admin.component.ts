import { Component, HostListener, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { RequestService } from '../services/request.service';
import { localeEs } from '../../assets/locale.es';
import { fadeInError } from '../config/animations.config';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../validators/CustomValidators';
import { Person } from '../models/persons';
declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [fadeInError]
})
export class AdminComponent implements OnInit {
  public isAdmin: boolean;
  public columnas: ColDef[] = [
    { headerName: "ID", filter: 'agNumberColumnFilter', sortable: true, field: "id", resizable: true },
    { headerName: 'Nombre', filter: 'agTextColumnFilter', sortable: true, field: "name", resizable: true },
    { headerName: 'Ruta', filter: 'agTextColumnFilter', sortable: true, field: "path", resizable: true },
    { headerName: 'Ultima versión', filter: 'agNumberColumnFilter', sortable: true, field: "isLastVersion" },
    { headerName: 'Fecha Creado', filter: 'agDateColumnFilter', sortable: true, field: "createdDate", resizable: true },
    { headerName: 'ID Padre', filter: 'agNumberColumnFilter', sortable: true, field: "idParent", resizable: true },
    { headerName: 'Eliminado', filter: 'agDateColumnFilter', sortable: true, field: "isRemoved", resizable: true },
    { headerName: 'Fecha Eliminado', filter: 'agDateColumnFilter', sortable: true, field: "removedDate", resizable: true },
    { headerName: 'Fecha Modificado', filter: 'agDateColumnFilter', sortable: true, field: "updateDate", resizable: true },
    { headerName: 'Encargado/a', filter: 'agTextColumnFilter', sortable: true, field: "author", resizable: true },
    { headerName: 'Motivo', filter: 'agTextColumnFilter', sortable: true, field: "reason", resizable: true },
  ];
  public datos: any
  public gridApi: any;
  public gridOptions = {}
  public selected: any;
  public persons: Person[] = [];
  public editRowForm: FormGroup;
  public overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Espera un momento.</span>';
  public overlayNoRowsTemplate =
    '<span style="padding: 10px; background: #f27428; color: #fff;">No hay datos.</span>';

  constructor(private request: RequestService) {
    this.editRowForm = new FormGroup({
      id: new FormControl({ value: 'id', disabled: true }),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.pattern('^[ A-zÀ-ú0-9_-]*$'),
        CustomValidator.hasExtension,
        this.validateFilename.bind(this),
      ]),
      path: new FormControl({ value: 'path', disabled: true }),
      isLastVersion: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(1),
      ]),
      createdDate: new FormControl('', [
        Validators.required,
        CustomValidator.dateValidator
      ]),
      idParent: new FormControl('', [
        Validators.min(1),
        Validators.max(9999),
      ]),
      isRemoved: new FormControl('', [
        Validators.min(0),
        Validators.max(1),
      ]),
      removedDate: new FormControl('', [
        CustomValidator.dateValidator
      ]),
      updateDate: new FormControl('', [
        Validators.required,
        CustomValidator.dateValidator
      ]),
      author: new FormControl('', [
        Validators.required
      ]),
      reason: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(300),
        Validators.pattern('^[ A-zÀ-ú0-9._-]*$')
      ])
    })
  }

  async ngOnInit(): Promise<void> {
    this.persons = await this.request.getPersons();
    const response = await this.request.isAuthenticated();
    this.isAdmin = response.isAuthenticated
    if (!this.isAdmin) this.request.redirectTo('workspace')
    if (this.isAdmin) await this.setDatos();
    this.gridOptions = {
      localeText: (key: string, defaultValue: string) => localeEs[key] || defaultValue,
    }
  }

  setFormValues() {
    const controls = this.editRowForm.controls;
    if (!controls) throw 'Error with the form information';
    if (this.selected) {
      controls['id'].setValue(this.selected.id);
      controls['name'].setValue(this.selected.name.split('.')[0]);
      controls['path'].setValue(this.selected.path);
      controls['isLastVersion'].setValue(this.selected.isLastVersion);
      controls['createdDate'].setValue(this.selected.createdDate);
      controls['idParent'].setValue(this.selected.idParent);
      controls['isRemoved'].setValue(this.selected.isRemoved);
      controls['removedDate'].setValue(this.selected.removedDate);
      controls['reason'].setValue(this.selected.reason);
    }
  }

  async setDatos() {
    this.datos = await this.request.getAllFiles()
  }

  @HostListener('window:resize')
  onResize() {
    this.restartSize();
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
    this.selected.extension = this.selected.name.split('.')[this.selected.name.split('.').length - 1];
    this.setFormValues();
  }

  async editRowSubmit() {
    const file = {}
    const where = {
      id: this.editRowForm.controls['id'].value
    }
    Object.keys(this.editRowForm.controls).forEach((key) => {
      if (key === 'name') {
        const name = this.editRowForm.controls[key];
        const selected = this.selected.name;
        const extension = selected.split('.')[selected.split('.').length - 1]
        if (!name.value.includes(extension)) {
          name.setValue(name.value + '.' + extension)
        }
      }
      if (this.editRowForm.controls[key].value !== this.selected[key]) {
        file[key] = this.editRowForm.controls[key].value
        if (key === 'isLastVersion' || key === 'isRemoved') {
          file[key] = parseInt(file[key])
          if (file[key] === 0) file[key] = null;
        }
      }
    })
    const data = {
      new: file,
      where: where,
      old: this.selected
    }
    this.editRowForm.controls['name'].setValue(this.editRowForm.controls['name'].value.split('.' + this.selected.name.split('.')[this.selected.name.split('.').length - 1])[0])
    const response = await this.request.updateRow(data)
    console.log(data);
    if (response) {
      await this.setDatos();
      this.modal('editRowModal', 'hide');
    }

  }

  validateFilename(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const value = this.selected;
      const valueName = control.value
      const valueWithExtension = valueName + '.' + value.extension;
      console.log(value, valueName, valueWithExtension);
      const response = this.datos.filter(row => {
        if (value.path === row.path && value.id !== row.id) {
          if (row.name.toLowerCase() === valueWithExtension.toLowerCase()) {
            return row.id;
          }
        }
      });
      if (response.length > 0) {
        return { 'nameExists': true }
      }
    }
    return null;
  }

  modal(id: string, state: string): void {
    $('#' + id).modal(state);
  }
}