
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RequestService } from '../services/request.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { slideIn, fadeIn, fadeOut, fadeInError } from '../config/animations.config';
import { FileInfo } from '../models/file.model';
import { AppUrl } from '../models/appurl.model';
import { Observable, Subscription, timer } from 'rxjs';
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
      fileReason: new FormControl()
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

  /* Methods */
  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('path')) {
      this.url.url = localStorage.getItem('path')
    }
    await this.getContent(this.getUrl());
  };

  public ngOnDestroy() {
    if (this.subscription && this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
  }

  adminEvent(event) {
    this.isAuth = event
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  filterRemoved() {
    this.request.notificate('Viendo archivos borrados');
    this.filteredFiles = this.content.files.filter(file => file.isRemoved === 1)
  }

  filterLastVersions() {
    this.request.notificate('Viendo últimas versiones');
    this.filteredFiles = this.content.files.filter(file => file.isLastVersion === 1)
  }

  noFilter() {
    this.request.notificate('Viendo todos los archivos');
    this.filteredFiles = this.content.files;
  }

  togglecheckBoxBoolean() {
    this.checkBoxBoolean = !this.checkBoxBoolean;
  }

  togglecheckReasonBoolean() {
    this.checkReasonBoolean = !this.checkReasonBoolean;
  }

  setSelected(element: string, isFile: boolean): void {
    this.selected = {
      element: element,
      isFile: isFile
    }
  }

  modal(id: string, state: string): void {
    $('#' + id).modal(state);
  }

  getUrl(): string {
    return this.url.url;
  }

  setPath(path: string): void {
    this.url.url = path;
  };

  checkExistence(): void {
    const file = this.fileInputField.nativeElement;
    if (file.files.length > 0) {
      this.fileInfo = new FileInfo(true, file.files[0].name, file.files[0].size)
    }
  }

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

  toggleExpandedFolders(): void {
    this.expandedFolders = !this.expandedFolders;
    const btnExtendFolders = this.btnExtendFolders.nativeElement;
    if (this.expandedFolders) {
      btnExtendFolders.innerHTML = 'Minimizar directorios <i class="bi bi-arrows-angle-contract ms-1"></i>'
    } else {
      btnExtendFolders.innerHTML = 'Desplegar directorios <i class="bi bi-arrows-angle-expand ms-1"></i>'
    }
  }

  toggleExpandedFiles(): void {
    this.expandedFiles = !this.expandedFiles;
    const btnExtendFiles = this.btnExtendFiles.nativeElement;
    if (this.expandedFiles) {
      btnExtendFiles.innerHTML = 'Minimizar archivos <i class="bi bi-arrows-angle-contract ms-1"></i>'
    } else {
      btnExtendFiles.innerHTML = 'Desplegar archivos <i class="bi bi-arrows-angle-expand ms-1"></i>'
    }
  }

  goForward(foldername: string): void {
    if (this.getUrl().includes('?path')) {
      this.setPath(this.getUrl() + '/' + foldername);
    } else {
      this.setPath(this.getUrl() + '?path=' + foldername);
    }
    localStorage.setItem('path', this.getUrl())
    this.getContent(this.getUrl());
  };

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

  async uploadFile(): Promise<void> {
    let fileList: FileList = this.fileInputField.nativeElement.files;
    let fileNewName = this.uploadFileForm.controls['fileNewName'].value ?? undefined;
    let reasonSwitch = this.uploadFileForm.controls['reasonSwitch'].value ?? undefined;
    let fileReason = this.uploadFileForm.controls['fileReason'].value ?? undefined;
    let fileRelated = this.uploadFileForm.controls['fileRelated'].value ?? undefined;
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
    await this.request.uploadFile(formData, options, this.getUrl(), fileNewName, fileRelated, fileReason);
    this.modal('uploadNameChange', 'hide');
    this.getContent(this.getUrl());
  };

  async makeDirectory(): Promise<void> {
    const directoryName = this.makeDirectoryForm.value.directory;
    if (directoryName) {
      await this.request.makeDirectory(this.getUrl(), directoryName);
    };
    this.modal('makeDirectoryModal', 'hide');
    this.getContent(this.getUrl());
  };

  async recoverFile(): Promise<void> {
    const id = this.selected.element.id;
    await this.request.recoverFile(id, this.recoverForm.controls['isLastVersion'].value);
    this.modal('recoverModal', 'hide');
    this.getContent(this.getUrl());
  };

  async deleteFile(file: string): Promise<void> {
    await this.request.deleteFile(this.getUrl(), file);
    this.modal('confirmationDelete', 'hide');
    this.getContent(this.getUrl());
  };

  async deleteFolder(folder: string): Promise<void> {
    await this.request.deleteDirectory(this.getUrl(), folder);
    this.modal('confirmationDelete', 'hide');
    this.getContent(this.getUrl());
  };

  async editFileNameSubmit() {
    await this.request.editElementName(this.getUrl(), this.editFileName.value.fileName + '.' + this.selected.element.split('.')[this.selected.element.split('.').length - 1], this.selected.element);
    this.modal('editFileName', 'hide');
    this.getContent(this.getUrl());
  }

  async editFolderNameSubmit() {
    await this.request.editElementName(this.getUrl(), this.editDirectoryName.value.folderName, this.selected.element);
    this.modal('editFolderName', 'hide');
    this.getContent(this.getUrl());
  }

  async getContent(path: string): Promise<void> {
    this.setTimer();
    this.content = [];
    this.content = await this.request.getWorkspace(path);
    this.filterLastVersions();
  };

  public setTimer() {
    this.showloader = true;
    this.timer = timer(500);
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }
}