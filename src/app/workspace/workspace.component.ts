import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html'
})

export class WorkspaceComponent implements OnInit {
  /* Atributes */
  public content: any;
  private position: string;
  private path: string;

  /* Constructor */
  constructor(private request: RequestService) { 
    this.path = 'http://localhost:3001/';
    this.position = this.path;
  }

  /* Methods */
  ngOnInit(): void {
    this.getContent(this.getPath());
  }

  getPosition(): string {
    return this.position;
  }

  setPosition(position: string): void {
    this.position = position;
  }

  getPath(): string {
    return this.path;
  }

  setPath(path: string): void {
    this.path = path;
  }

  async postFile(event: any) {
    if (event.path[1][0].files.length > 0) {
      const inputField = event.path[1][0].files;
      let fileList: FileList = inputField;
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      let headers = new Headers();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      let options = { headers: headers };
      await this.request.postFile(formData, options, this.getPath())
    }
    this.getContent(this.getPath());
  }

  getBack(): void {
    if (this.getPath().includes('?path=')){
      if (this.getPath().substring(0, this.getPath().lastIndexOf('/')) === 'http://localhost:3001'){
        this.setPath(this.getPath().substring(0, this.getPath().lastIndexOf('/')) + '/');
      } else {
        this.setPath(this.getPath().substring(0, this.getPath().lastIndexOf('/')));
      }
      this.getContent(this.getPath());
    }
  }

  async deleteFile(file: string) {
    await this.request.deleteFile(this.getPath(), file)
    this.getContent(this.getPath());
  }

  async selectedFolder(foldername: string): Promise <void> {
    if (this.getPath().includes('?path')) {
      this.setPath(this.getPath() + '/' + foldername)
    } else {
      this.setPath(this.getPath() + '?path=' + foldername)
    }
    this.getContent(this.getPath())
  }

  async getContent(path: string): Promise <void> {
    this.content = await this.request.getWorkspace(path);
  }

}
