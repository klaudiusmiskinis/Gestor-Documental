import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RequestService {
  private content: any;
  private error: any;
  constructor(private http: HttpClient) {}

  async getWorkspace(path: string): Promise <Object> {
    this.setContent(this.parse(await this.http.get(path).toPromise()));
    return this.getContent();
  }

  async deleteFile(path: string, file: string): Promise <void> {
    let char = this.setParameterChar(path);
    const status = this.parse(await this.http.delete(path + char + 'file=' + file).toPromise());
    if (!status.success) {
      this.setError('Ha habido un error eliminando el archivo.');
    } else {
      this.setContent(status);
    }
  }
  
  async deleteDirectory(path: string, folder: string): Promise <void> {
    let char = this.setParameterChar(path);
    const status = this.parse(await this.http.delete(path + char + 'folder=' + folder).toPromise());
    if (!status.success) {
      this.setError('Ha habido un error eliminando el archivo.');
    } else {
      this.setContent(status);
    }
  }

  async postDirectory(path: string, directoryName: string): Promise <void> {
    let char = this.setParameterChar(path);
    const status = this.parse(await this.http.post(path +  char + 'folder=' + directoryName, []).toPromise());
    if (!status.success) {
      this.setError('Error con la creación de la carpeta');
    } else {
      this.setContent(status);
    }
  }

  async postFile(formData: FormData, options: Object, path: string): Promise <void>  {
    const status = this.parse(await this.http.post(path, formData, options).toPromise());
    if (!status.success) {
      this.setError('Error con la subida del archivo');
    } else {
      this.setContent(status);
    }
  }

  async getFile(path: string, file: string): Promise <void> {
    let char = this.setParameterChar(path);
    console.log(char)
    const status = this.parse(await this.http.get(path + char + 'download=' + file).toPromise());
    if (!status.success) {
      this.setError('Error con la subida del archivo');
    } else {
      this.setContent(status);
    }
  }
  
  parse(request: any): any {
    return JSON.parse(JSON.stringify(request));
  }

  setParameterChar(path: string): string {
    if (path.includes('?')) {
      return '&' as string;
    } else {
      return '?' as string;
    }
  };

  getContent(): Object {
    return this.content;
  };

  setContent(content: any): void {
    this.content = content;
  };

  getError(): string {
    return this.error;
  };

  setError(error: string): void {
    this.error = error;
  };
};
