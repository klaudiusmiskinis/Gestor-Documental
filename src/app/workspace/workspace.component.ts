
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RequestService } from '../services/request.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { slideIn, fadeIn, fadeOut, fadeInError } from '../config/animations.config';
import { FileInfo } from '../models/file.model';
import { AppUrl } from '../models/appurl.model';
import { Observable, Subscription, timer } from 'rxjs';
import { Person } from '../models/persons';
declare var $: any;

@Component({
  selector: 'workspace',
  templateUrl: './workspace.component.html',
  animations: [slideIn, fadeIn, fadeOut, fadeInError]
})

export class WorkspaceComponent implements OnInit, AfterViewChecked {
  /* Atributes */
  public url: AppUrl;
  public content: any;
  public selected: any;
  public fileInfo: FileInfo;
  public checkBoxBoolean: boolean;
  public checkReasonBoolean: boolean;
  public makeDirectoryForm: FormGroup;
  public uploadFileForm: FormGroup;
  public recoverForm: FormGroup;
  public editDirectoryName: FormGroup;
  public editFileName: FormGroup;
  public newResourceName: FormControl;
  public tooltip: object;
  public expandedFolders: boolean;
  public expandedFiles: boolean;
  public showloader: boolean;
  public filteredFiles: any;
  public persons: Person[] = [];
  private subscription: Subscription;
  private timer: Observable<any>;
  public isAuth: boolean
  @ViewChild('btnExtendFolders') btnExtendFolders: ElementRef;
  @ViewChild('btnExtendFiles') btnExtendFiles: ElementRef;

  /* Constructor */
  constructor(private request: RequestService, private cdRef: ChangeDetectorRef) {
    this.url = new AppUrl('http://localhost:3001/');
    this.newResourceName = new FormControl('', [Validators.required])
    this.fileInfo = new FileInfo(false);
    this.checkBoxBoolean = true;
    this.checkReasonBoolean = false;
    this.selected = true;
    this.tooltip = {
      arrow: true,
      placement: 'bottom',
      animation: 'fade',
      delay: [500, 0],
    };
    this.expandedFolders = true;
    this.expandedFiles = true;
    this.showloader = false;
    this.uploadFileForm = new FormGroup({
      reasonSwitch: new FormControl(false),
      fileNewName: new FormControl(),
      fileRelated: new FormControl(false, [Validators.required]),
      fileReason: new FormControl(),
      author: new FormControl('')
    });

    this.setConditionalValidators(true, 'fileNewName', true, true, true, 3, 30);
    this.uploadFileForm.controls['reasonSwitch'].valueChanges.subscribe(() => this.setConditionalValidators(this.uploadFileForm.controls['reasonSwitch'].value, 'fileReason', true, true, false, 3, 300));

    this.recoverForm = new FormGroup({
      isLastVersion: new FormControl(false, [
        Validators.required
      ])
    })

    this.makeDirectoryForm = new FormGroup({
      directory: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[A-zÀ-ú0-9_-]*$'),
        this.validateFoldername.bind(this),
        this.validateFilename.bind(this)
      ])
    });

    this.editDirectoryName = new FormGroup({
      folderName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
        Validators.pattern('^[ A-zÀ-ú0-9_-]*$'),
        this.validateFoldername.bind(this),
        this.validateFilename.bind(this)
      ])
    });

    this.editFileName = new FormGroup({
      fileName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
        Validators.pattern('^[ A-zÀ-ú0-9_-]*$'),
        this.validateFilename.bind(this)
      ])
    });
  };

  @ViewChild('fileInputField') fileInputField: ElementRef;

  /**
   * Método para cuando el componente cargue.
   */
  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('path')) {
      this.url.url = localStorage.getItem('path')
    }
    this.persons = await this.request.getPersons();
    await this.getContent(this.getUrl());
  };

  /**
   * Método para cuando el componente se destruya.
   */
  public ngOnDestroy() {
    if (this.subscription && this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Método para manejar el evento de admin.
   */
  adminEvent(event) {
    this.isAuth = event
  }

  /**
   * Método para manejar el evento cuando la vista esta cargada.
   */
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  /**
   * Filtro para archivos borrados
   */
  filterRemoved(): void {
    this.request.notificate('Viendo archivos borrados');
    this.filteredFiles = this.content.files.filter(file => file.isRemoved === 1)
  }

  /**
   * Filtro para ultimas versiones
   */
  filterLastVersions(): void {
    this.request.notificate('Viendo últimas versiones');
    this.filteredFiles = this.content.files.filter(file => file.isLastVersion === 1)
  }

  /**
   * Filtro para ver todos los archivos
   */
  noFilter() {
    this.request.notificate('Viendo todos los archivos');
    this.filteredFiles = this.content.files;
  }

  /**
   * Toggle para nombre
   */
  togglecheckBoxBoolean() {
    this.checkBoxBoolean = !this.checkBoxBoolean;
  }

  /**
   * Toggle para motivo/razon
   */
  togglecheckReasonBoolean() {
    this.checkReasonBoolean = !this.checkReasonBoolean;
  }

  /**
   * Asigna el elemento al que se ha seleccionado para los formularios de acciones
   */
  setSelected(element: string, isFile: boolean): void {
    this.selected = {
      element: element,
      isFile: isFile
    }
  }

  /**
     * Permite mostrar o esconder un modal.
     * @param id string
     * @param state string
     */
  modal(id: string, state: string): void {
    $('#' + id).modal(state);
  }

  /**
   * Devuelve el atributo url
   * @returns string
   */
  getUrl(): string {
    return this.url.url;
  }

  /**
   * Da valor al atributo url
   * @param path string
   */
  setPath(path: string): void {
    this.url.url = path;
  };

  /**
   * Comprueba si existe el archivo en el input.
   */
  checkExistence(): void {
    const file = this.fileInputField.nativeElement;
    if (file.files.length > 0) {
      this.fileInfo = new FileInfo(true, file.files[0].name, file.files[0].size)
    }
  }

  /**
   * Asigna diferentes validadores dependiendo de si es true o false el checkbox marcado.
   * @param value any
   * @param field string
   * @param minLength boolean
   * @param maxLength boolean
   * @param names boolean
   * @param minLengthChars number
   * @param maxLengthChars number
   */
  setConditionalValidators(value: any, field: string, minLength: boolean, maxLength: boolean, names: boolean, minLengthChars?: number | any, maxLengthChars?: number | any) {
    const validators: ValidatorFn | ValidatorFn[] | null = [];
    if (value) {
      validators.push(Validators.required, Validators.pattern('^[ A-zÀ-ú0-9_-]*$'))
    }
    if (names) {
      validators.push(this.validateFilename.bind(this), this.validateFoldername.bind(this))
    }
    if (minLength && value) {
      validators.push(Validators.minLength(minLengthChars));
    }
    if (maxLength && value) {
      validators.push(Validators.maxLength(maxLengthChars));
    }

    if (value) {
      this.uploadFileForm.controls[field].setValidators(validators);
    } else {
      this.uploadFileForm.controls[field].setErrors(null)
    }
    this.uploadFileForm.updateValueAndValidity();
  }

  /**
   * Asigna texto y valor contrario al estado de expandido o contraido del HTML
   */
  toggleExpandedFolders(): void {
    this.expandedFolders = !this.expandedFolders;
    const btnExtendFolders = this.btnExtendFolders.nativeElement;
    if (this.expandedFolders) {
      btnExtendFolders.innerHTML = 'Minimizar directorios <i class="bi bi-arrows-angle-contract ms-1"></i>'
    } else {
      btnExtendFolders.innerHTML = 'Desplegar directorios <i class="bi bi-arrows-angle-expand ms-1"></i>'
    }
  }

  /**
  * Asigna texto y valor contrario al estado de expandido o contraido del HTML
  */
  toggleExpandedFiles(): void {
    this.expandedFiles = !this.expandedFiles;
    const btnExtendFiles = this.btnExtendFiles.nativeElement;
    if (this.expandedFiles) {
      btnExtendFiles.innerHTML = 'Minimizar archivos <i class="bi bi-arrows-angle-contract ms-1"></i>'
    } else {
      btnExtendFiles.innerHTML = 'Desplegar archivos <i class="bi bi-arrows-angle-expand ms-1"></i>'
    }
  }

  /**
   * Nos permite entrar dentro de las carpetas
   * @param foldername string
   */
  goForward(foldername: string): void {
    if (this.getUrl().includes('?path')) {
      this.setPath(this.getUrl() + '/' + foldername);
    } else {
      this.setPath(this.getUrl() + '?path=' + foldername);
    }
    localStorage.setItem('path', this.getUrl())
    this.getContent(this.getUrl());
  };

  /**
   * Nos permite volver a la carpeta padre
   */
  goBack(): void {
    if (this.getUrl().includes('?path=')) {
      if (this.getUrl().substring(0, this.getUrl().lastIndexOf('/')) === 'http://localhost:3001') {
        this.setPath(this.getUrl().substring(0, this.getUrl().lastIndexOf('/')) + '/');
      } else {
        this.setPath(this.getUrl().substring(0, this.getUrl().lastIndexOf('/')));
      };
      localStorage.setItem('path', this.getUrl())
      this.getContent(this.getUrl());
    };
  };

  /**
   * Permite manejar los eventos de las carpetas
   * @param event 
   */
  folderEvent(event) {
    this.setSelected(event.folder, false);
    switch (event.type) {
      case 'edit':
        this.modal('editFolderName', 'show');
        break;
      case 'goinside':
        this.goForward(event.folder);
        break;
      case 'delete':
        this.modal('confirmationDelete', 'show');
        break;
    }
  }

  /**
   * Permite manejar los eventos de los archivos
   * @param event 
   */
  fileEvent(event) {
    this.setSelected(event.file, true);
    switch (event.type) {
      case 'edit':
        this.modal('editFileName', 'show');
        break;
      case 'delete':
        this.modal('confirmationDelete', 'show');
        break;
      case 'recover':
        this.modal('recoverModal', 'show');
        break;
    }
  }

  /**
   * Devuelve un objeto con el nombre del error como validador.f
   * @param control AbstractControl
   * @returns object | null
   */
  validateFoldername(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const name = control.value.toLowerCase()
      const response = this.content.folders.filter(folder => {
        folder = folder.toLowerCase();
        if (folder === name) {
          return folder;
        }
      });
      if (response.length > 0) {
        return { 'nameExists': true }
      }
    }
    return null;
  }

  /**
   * Devuelve un objeto con el nombre del error como validador.f
   * @param control AbstractControl
   * @returns object | null
   */
  validateFilename(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const name = control.value.toLowerCase();
      const response = this.content.files.filter(file => {
        const nameCompare = file.name.toLowerCase();
        const fileWithoutDot = file.name.split('.')[0];
        if (nameCompare === name || fileWithoutDot === name) {
          return file;
        }
      });
      if (response.length > 0) {
        return { 'nameExists': true }
      }
    }
    return null;
  }

  /**
   * Maneja el archivo adjuntado para permitir enviarlo al backend
   */
  async uploadFile(): Promise<void> {
    let fileList: FileList = this.fileInputField.nativeElement.files;
    let fileNewName = this.uploadFileForm.controls['fileNewName'].value ?? undefined;
    let reasonSwitch = this.uploadFileForm.controls['reasonSwitch'].value ?? undefined;
    let fileReason = this.uploadFileForm.controls['fileReason'].value ?? undefined;
    let fileRelated = this.uploadFileForm.controls['fileRelated'].value ?? undefined;
    const author = this.uploadFileForm.controls['author'].value ?? undefined;
    const formData: FormData = new FormData();
    const headers = new Headers();
    if (fileList[0]) {
      formData.append('file', fileList[0], fileList[0].name);
    }
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers
    };
    if (!reasonSwitch) fileReason = undefined;
    if (!fileRelated) fileRelated = undefined;
    await this.request.uploadFile(formData, options, this.getUrl(), fileNewName, fileRelated, fileReason, author);
    this.modal('uploadNameChange', 'hide');
    this.getContent(this.getUrl());
  };

  /**
   * Request HTTP para poder crear carpetas
   */
  async makeDirectory(): Promise<void> {
    const directoryName = this.makeDirectoryForm.value.directory;
    if (directoryName) {
      await this.request.makeDirectory(this.getUrl(), directoryName);
    };
    this.modal('makeDirectoryModal', 'hide');
    this.getContent(this.getUrl());
  };

  /**
   * Request HTTP para poder recuperar archivos borrados
   */
  async recoverFile(): Promise<void> {
    const id = this.selected.element.id;
    await this.request.recoverFile(id, this.recoverForm.controls['isLastVersion'].value);
    this.modal('recoverModal', 'hide');
    this.getContent(this.getUrl());
  };

  /**
   * Request HTTP para poder eliminar archivos
   * @param file string
   */
  async deleteFile(file: string): Promise<void> {
    await this.request.deleteFile(this.getUrl(), file);
    this.modal('confirmationDelete', 'hide');
    this.getContent(this.getUrl());
  };

  /**
   * Request HTTP para poder eliminar carpetas
   * @param folder string
   */
  async deleteFolder(folder: string): Promise<void> {
    await this.request.deleteDirectory(this.getUrl(), folder);
    this.modal('confirmationDelete', 'hide');
    this.getContent(this.getUrl());
  };

  /**
   * Request HTTP para poder editar nombre del archivo
   * @param folder string
   */
  async editFileNameSubmit() {
    await this.request.editElementName(this.getUrl(), this.editFileName.value.fileName + '.' + this.selected.element.split('.')[this.selected.element.split('.').length - 1], this.selected.element);
    this.modal('editFileName', 'hide');
    this.getContent(this.getUrl());
  }

  /**
   * Request HTTP para poder editar nombre de la carpeta
   * @param folder string
   */
  async editFolderNameSubmit() {
    await this.request.editElementName(this.getUrl(), this.editDirectoryName.value.folderName, this.selected.element);
    this.modal('editFolderName', 'hide');
    this.getContent(this.getUrl());
  }

  /**
   * Nos permite cargar los datos recibidos de la API
   * @param path string
   */
  async getContent(path: string): Promise<void> {
    this.setTimer();
    this.content = [];
    this.content = await this.request.getWorkspace(path);
    this.filterLastVersions();
  };

  /**
   * Evento para mostrar la carga de los archivos
   */
  public setTimer() {
    this.showloader = true;
    this.timer = timer(500);
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }
}