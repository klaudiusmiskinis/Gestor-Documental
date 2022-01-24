
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RequestService } from '../services/request.service';
import { MatAccordion } from '@angular/material/expansion';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { slideIn, fadeIn, fadeOut } from '../config/animations.config';
import { NotifierService } from 'angular-notifier';
import { FileInfo } from '../models/file.model';
import { AppUrl } from '../models/appurl.model';
declare var $: any;
@Component({
  selector: 'workspace',
  templateUrl: './workspace.component.html',
  animations: [slideIn, fadeIn, fadeOut]
})

export class WorkspaceComponent implements OnInit {
  /* Atributes */
  public url: AppUrl;
  public content: any;
  public selected: any;
  public fileInfo: FileInfo;
  public checkBoxBoolean: boolean;
  public makeDirectoryForm: FormGroup;
  public editDirectoryName: FormGroup;
  public editFileName: FormGroup;
  public newResourceName: FormControl;
  private notifier: NotifierService;

  /* Constructor */
  constructor(private request: RequestService, notifier: NotifierService) {
    this.url = new AppUrl('http://localhost:3001/');
    this.newResourceName = new FormControl('', [Validators.required])
    this.fileInfo = new FileInfo(false);
    this.checkBoxBoolean = false;
    this.notifier = notifier;
    this.selected = true;
    this.makeDirectoryForm = new FormGroup({
      directory: new FormControl('', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(50), 
        Validators.pattern('^[a-zA-Z\\s]+$'),
        this.validateFoldername.bind(this)
      ])
    })

    this.editDirectoryName = new FormGroup({
      folderName: new FormControl('', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(50), 
        Validators.pattern('^[a-zA-Z\\s]+$'),
        this.validateFoldername.bind(this)
      ])
    })

    this.editFileName = new FormGroup({
      fileName: new FormControl('', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(50), 
        Validators.pattern('^[A-Za-z0-9-\\s]+$'),
        this.validateFilename.bind(this)
      ])
    })
  };

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('fileInputField') fileInputField: ElementRef;
  @ViewChild('newName') newName: ElementRef;

  /* Methods */
  async ngOnInit(): Promise <void> {
    await this.getContent(this.url.url);
  };

  validateFoldername(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value) {
      let response = this.content.folders.filter(folder => {
        if(folder === control.value) {
          return folder;
        }
      });
      if (response.length > 0) {
        return {'nameExists': true}
      }
    }
    return null;
  }

  validateFilename(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value) {
      let response = this.content.files.filter(file => {
        const fileWithoutDot = file.split('.')[0];
        if(file === control.value || control.value === fileWithoutDot) {
          return file;
        }
      });
      if (response.length > 0) {
        return {'nameExists': true}
      }
    }
    return null;
  }

  togglecheckBoxBoolean() {
    this.checkBoxBoolean = !this.checkBoxBoolean;
  }

  setSelected(element: string, isFile: boolean): void {
    this.selected = {
      element: element,
      isFile: isFile
    }
  }

  modalDelete(state: string): void {
    $('#confirmationDelete').modal(state);
  }

  modalUpload(state: string): void {
    $('#uploadNameChange').modal(state);
  }

  modalmakeDirectory(state: string): void {
    $('#makeDirectoryModal').modal(state);
  }

  modalEditFile(state: string): void {
    $('#editFileName').modal(state);
  }

  modalEditFolder(state: string): void {
    $('#editFolderName').modal(state);
  }

  folderEvent(event) {
    this.setSelected(event.folder, false);
    switch (event.type) {
      case 'edit':
          this.modalEditFolder('show');
      break;
      case 'goinside':
        this.selectedFolder(event.folder);
      break;
      case 'delete':
        this.modalDelete('show');
      break;
    }
  }

  fileEvent(event) {
    this.setSelected(event.file, true);
    switch (event.type) {
      case 'edit':
        this.modalEditFile('show');
      break;
      case 'delete': 
        this.modalDelete('show');
      break;
    }
  }

  public showNotification(type: string, message: string): void {
		this.notifier.notify(type, message);
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

  checkFolderName(): any {
    if (this.content.folders) {
      const directoryName = this.makeDirectoryForm.value.directory;
      this.content.folders.filter(folder => {
        if(folder === directoryName) {
          return true;
        } else {
          return false;
        }
      })
    }
  }

  async uploadFile(): Promise <void> {
    const fileList: FileList = this.fileInputField.nativeElement.files;
    const file: File = fileList[0];
    const formData: FormData = new FormData();
    const headers = new Headers();
    formData.append('file', file, file.name);
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers 
    };
    await this.request.uploadFile(formData, options, this.getUrl(), this.newName.nativeElement.value);
    this.modalUpload('hide');
    this.getContent(this.getUrl());
  };

  goBack(): void {
    if (this.getUrl().includes('?path=')) {
      if (this.getUrl().substring(0, this.getUrl().lastIndexOf('/')) === 'http://192.168.1.148:3001') {
        this.setPath(this.getUrl().substring(0, this.getUrl().lastIndexOf('/')) + '/');
      } else {
        this.setPath(this.getUrl().substring(0, this.getUrl().lastIndexOf('/')));
      };
      this.getContent(this.getUrl());
    };
  };

  async makeDirectory(): Promise <void> {
    const directoryName = this.makeDirectoryForm.value.directory;
    if (directoryName) {
      await this.request.makeDirectory(this.getUrl(), directoryName);
    };
    this.getContent(this.getUrl());
    this.modalEditFile('hide');
  };

  async deleteFile(file: string): Promise <void> {
    await this.request.deleteFile(this.getUrl(), file);
    this.getContent(this.getUrl());
    this.modalDelete('hide');
  };

  async deleteFolder(folder: string): Promise <void> {
    await this.request.deleteDirectory(this.getUrl(), folder);
    this.getContent(this.getUrl());
    this.modalDelete('hide');
  };

  async editFileNameSubmit() {
    await this.request.editElementName(this.getUrl(), this.editFileName.value.fileName + '.' + this.selected.element.split('.')[this.selected.element.split('.').length - 1], this.selected.element);
    this.getContent(this.getUrl());
  }

  async editFolderNameSubmit() {
    console.log('asd')
  }

  async selectedFolder(foldername: string): Promise <void> {
      if (this.getUrl().includes('?path')) {
        this.setPath(this.getUrl() + '/' + foldername);
      } else {
        this.setPath(this.getUrl() + '?path=' + foldername);
      }
      this.getContent(this.getUrl());
  };

  async getContent(path: string): Promise <void> {
    this.content = [];
    this.content = await this.request.getWorkspace(path);
  };

}