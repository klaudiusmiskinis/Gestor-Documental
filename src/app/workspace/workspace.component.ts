
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RequestService } from '../services/request.service';
import { MatAccordion } from '@angular/material/expansion';
import { NotifierService } from 'angular-notifier';
import { FileInfo } from '../models/file.model';
import { slideIn, fadeIn } from '../config/animations.config';
import { AppUrl } from '../models/appurl.model';
import { FormControl, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'workspace',
  templateUrl: './workspace.component.html',
  animations: [slideIn, fadeIn]
})

export class WorkspaceComponent implements OnInit {
  /* Atributes */
  public url: AppUrl;
  public content: any;
  public fileInfo: FileInfo;
  public selected: any;
  public newResourceName: FormControl;
  private notifier: NotifierService;

  /* Constructor */
  constructor(private request: RequestService, notifier: NotifierService) {
    this.url = new AppUrl('http://localhost:3001/');
    this.newResourceName = new FormControl('', [Validators.required])
    this.fileInfo = new FileInfo(false);
    this.notifier = notifier;
    this.selected = true;
  };

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('fileInputField') fileInputField: ElementRef;
  @ViewChild('editNewNameCheckBox') checkBoxName: ElementRef;

  /* Methods */
  async ngOnInit(): Promise <void> {
    await this.getContent(this.url.url);
  };

  info() {
    console.log(this.checkBoxName.nativeElement.value)
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

  folderEvent(event) {
    this.setSelected(event.folder, false);
    switch (event.type) {
      case 'edit':
          console.log('edit', event.folder);
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
        console.log('edit', event.file);
      break;
      case 'delete': 
        this.modalDelete('show');
      break;
    }
  }

  public showNotification( type: string, message: string ): void {
		this.notifier.notify(type, message);
	}

  geUrl() {
    return this.url.url;
  }

  setPath(path: string): void {
    this.url.url = path;
  };

  async makeDirectory(event: any): Promise <void> {
    const directoryName = event.path[1].firstChild.value;
    if (directoryName) {
      await this.request.makeDirectory(this.geUrl(), directoryName);
    };
    this.getContent(this.geUrl());
  };

  checkExistence() {
    const file = this.fileInputField.nativeElement;
    if (file.files.length > 0) {
      this.fileInfo = new FileInfo(true, file.files[0].name, file.files[0].size)
    }
  }

  async uploadFile(): Promise <void> {
    const fileList: FileList = this.fileInputField.nativeElement.files;
    const file: File = fileList[0];
    const formData: FormData = new FormData();
    const headers = new Headers();
    console.log(file)
    formData.append('file', file, file.name);
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers 
    };
    await this.request.uploadFile(formData, options, this.geUrl());
    this.getContent(this.geUrl());
  };

  goBack(): void {
    if (this.geUrl().includes('?path=')) {
      if (this.geUrl().substring(0, this.geUrl().lastIndexOf('/')) === 'http://localhost:3001') {
        this.setPath(this.geUrl().substring(0, this.geUrl().lastIndexOf('/')) + '/');
      } else {
        this.setPath(this.geUrl().substring(0, this.geUrl().lastIndexOf('/')));
      }
      this.getContent(this.geUrl());
    };
  };

  async deleteFile(file: string): Promise <void> {
    await this.request.deleteFile(this.geUrl(), file);
    this.getContent(this.geUrl());
    this.modalDelete('hide');
  };

  async deleteFolder(folder: string): Promise <void> {
    await this.request.deleteDirectory(this.geUrl(), folder);
    this.getContent(this.geUrl());
    this.modalDelete('hide');
  };

  async selectedFolder(foldername: string): Promise <void> {
      if (this.geUrl().includes('?path')) {
        this.setPath(this.geUrl() + '/' + foldername);
      } else {
        this.setPath(this.geUrl() + '?path=' + foldername);
      }
      this.getContent(this.geUrl());
  };

  async getContent(path: string): Promise <void> {
    this.content = [];
    this.content = await this.request.getWorkspace(path);
  };

}