
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RequestService } from '../services/request.service';
import { MatAccordion } from '@angular/material/expansion';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { slideIn, fadeIn, fadeOut } from '../config/animations.config';
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
  public checkReasonBoolean: boolean;
  public makeDirectoryForm: FormGroup;
  public editDirectoryName: FormGroup;
  public editFileName: FormGroup;
  public newResourceName: FormControl;
  public tooltip: object;

  /* Constructor */
  constructor(private request: RequestService) {
    this.url = new AppUrl('http://localhost:3001/');
    this.newResourceName = new FormControl('', [Validators.required])
    this.fileInfo = new FileInfo(false);
    this.checkBoxBoolean = false;
    this.checkReasonBoolean = false;
    this.selected = true;
    this.tooltip = {
      arrow: false,
      placement: 'bottom'
    }

    this.makeDirectoryForm = new FormGroup({
      directory: new FormControl('', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(50), 
        Validators.pattern('^[a-zA-Z\\s]+$'),
        this.validateFoldername.bind(this),
        this.validateFilename.bind(this)
      ])
    })

    this.editDirectoryName = new FormGroup({
      folderName: new FormControl('', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(50), 
        Validators.pattern('^[a-zA-Z\\s]+$'),
        this.validateFoldername.bind(this),
        this.validateFilename.bind(this)
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
  @ViewChild('fileRelated') fileRelated: ElementRef;
  @ViewChild('fileVersion') fileVersion: ElementRef;
  @ViewChild('fileNewName') fileNewName: ElementRef;
  @ViewChild('fileReason') fileReason: ElementRef;

  /* Methods */
  async ngOnInit(): Promise <void> {
    await this.getContent(this.url.url);
  };

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

  goForward(foldername: string): void {
    if (this.getUrl().includes('?path')) {
      this.setPath(this.getUrl() + '/' + foldername);
    } else {
      this.setPath(this.getUrl() + '?path=' + foldername);
    }
    this.getContent(this.getUrl());
  };

  goBack(): void {
    if (this.getUrl().includes('?path=')) {
      if (this.getUrl().substring(0, this.getUrl().lastIndexOf('/')) === 'http://localhost:3001') {
        this.setPath(this.getUrl().substring(0, this.getUrl().lastIndexOf('/')) + '/');
      } else {
        this.setPath(this.getUrl().substring(0, this.getUrl().lastIndexOf('/')));
      };
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
    }
  }
  
  validateFoldername(control: AbstractControl): {[key: string]: any} | null  {
    const name = control.value.toLowerCase()
    if (name) {
      let response = this.content.folders.filter(folder => {
        folder = folder.toLowerCase();
        if(folder === name) {
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
    const name = control.value.toLowerCase()
    if (control.value) {
      let response = this.content.files.filter(file => {
        const nameCompare = file.toLowerCase();
        const fileWithoutDot = file.split('.')[0];
        if(nameCompare === name || fileWithoutDot === name) {
          return file;
        }
      });
      if (response.length > 0) {
        return {'nameExists': true}
      }
    }
    return null;
  }

  async uploadFile(): Promise <void> {
    const fileList: FileList = this.fileInputField.nativeElement.files;
    const fileRelated = this.fileRelated.nativeElement;
    const fileReason = this.fileReason.nativeElement;
    const formData: FormData = new FormData();
    const headers = new Headers();
    formData.append('file', fileList[0], fileList[0].name);
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers 
    };
    await this.request.uploadFile(formData, options, this.getUrl(), this.fileNewName.nativeElement.value, fileRelated.value, fileReason.value);
    this.modal('uploadNameChange', 'hide');
    this.getContent(this.getUrl());
  };

  async makeDirectory(): Promise <void> {
    const directoryName = this.makeDirectoryForm.value.directory;
    if (directoryName) {
      await this.request.makeDirectory(this.getUrl(), directoryName);
    };
    this.modal('makeDirectoryModal', 'hide');
    this.getContent(this.getUrl());
  };

  async deleteFile(file: string): Promise <void> {
    await this.request.deleteFile(this.getUrl(), file);
    this.modal('confirmationDelete', 'hide');
    this.getContent(this.getUrl());
  };

  async deleteFolder(folder: string): Promise <void> {
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

  async getContent(path: string): Promise <void> {
    this.content = [];
    this.content = await this.request.getWorkspace(path);
  };

}