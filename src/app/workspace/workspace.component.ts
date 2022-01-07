
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RequestService } from '../services/request.service';
import { MatAccordion } from '@angular/material/expansion';
import { NotifierService } from 'angular-notifier';
import { FileInfo } from '../models/file.model';
import { Path } from '../models/path.model';
import { slideIn } from '../config/animations.config';
import { AppUrl } from '../models/appurl.model';

@Component({
  selector: 'workspace',
  templateUrl: './workspace.component.html',
  animations: [slideIn]
})

export class WorkspaceComponent implements OnInit {
  /* Atributes */
  public content: any;
  public fileInfo: FileInfo;
  public testModel: AppUrl;
  private path: Path;
  private notifier: NotifierService;

  /* Constructor */
  constructor(private request: RequestService, notifier: NotifierService) {
    this.testModel = new AppUrl('http://localhost:3001/', [{name: 'folder', data: 'asd'}]);
    this.testModel.addParameter({name: 'file', data: 'asdasd'})
    this.testModel.getFinalUrl();
    this.testModel.removeParameter('folder');
    this.testModel.getFinalUrl();
    this.fileInfo = new FileInfo(false);
    this.notifier = notifier;
    this.path = new Path('http://localhost:3001/');
  };

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('fileInputField') fileInputField: ElementRef

  /* Methods */
  async ngOnInit(): Promise <void> {
    await this.getContent(this.path._path);
  };

  folderEvent(event) {
    switch (event.type) {
      case 'edit':
          console.log('edit', event.folder);
      break;
      case 'goinside':
        this.selectedFolder(event.folder);
      break;
      case 'delete': 
        this.deleteFolder(event.folder);
      break;
    }
  }

  fileEvent(event) {
    switch (event.type) {
      case 'edit':
        console.log('edit', event.file);
      break;
      case 'delete': 
        this.deleteFile(event.file);
      break;
    }
  }

  public showNotification( type: string, message: string ): void {
		this.notifier.notify(type, message);
	}

  getPath() {
    return this.path._path;
  }

  setPath(path: string): void {
    this.path._path = path;
  };

  async makeDirectory(event: any): Promise <void> {
    const directoryName = event.path[1].firstChild.value;
    if (directoryName) {
      await this.request.makeDirectory(this.getPath(), directoryName);
    };
    this.getContent(this.getPath());
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
    await this.request.uploadFile(formData, options, this.getPath());
    this.getContent(this.getPath());
  };

  goBack(): void {
    if (this.getPath().includes('?path=')) {
      if (this.getPath().substring(0, this.getPath().lastIndexOf('/')) === 'http://localhost:3001') {
        this.setPath(this.getPath().substring(0, this.getPath().lastIndexOf('/')) + '/');
      } else {
        this.setPath(this.getPath().substring(0, this.getPath().lastIndexOf('/')));
      }
      this.getContent(this.getPath());
    };
  };

  async deleteFile(file: string): Promise <void> {
    await this.request.deleteFile(this.getPath(), file);
    this.getContent(this.getPath());
  };

  async deleteFolder(folder: string): Promise <void> {
    await this.request.deleteDirectory(this.getPath(), folder);
    this.getContent(this.getPath());
  };

  async selectedFolder(foldername: string): Promise <void> {
      if (this.getPath().includes('?path')) {
        this.setPath(this.getPath() + '/' + foldername);
      } else {
        this.setPath(this.getPath() + '?path=' + foldername);
      }
      this.getContent(this.getPath());
  };

  async getContent(path: string): Promise <void> {
    this.content = [];
    this.content = await this.request.getWorkspace(path);
  };

}
