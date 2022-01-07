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
    this.setContent(this.parse(await this.http.get<any>(path).toPromise()));
    return this.getContent();
  };

  async deleteFile(path: string, file: string): Promise <void> {
    let char = this.setParameterChar(path);
    const status = this.parse(await this.http.delete<any>(path + char + 'file=' + file).toPromise());
    if (!status.success) {
      this.setError('Ha habido un error eliminando el archivo.');
    } else {
      this.setContent(status);
    };
  };
  
  async deleteDirectory(path: string, folder: string): Promise <void> {
    let char = this.setParameterChar(path);
    const status = this.parse(await this.http.delete<any>(path + char + 'folder=' + folder).toPromise());
    if (!status.success) {
      this.setError('Ha habido un error eliminando el archivo.');
    } else {
      this.setContent(status);
    };
  };

  async makeDirectory(path: string, directoryName: string): Promise <void> {
    let char = this.setParameterChar(path);
    const status = this.parse(await this.http.post<any>(path +  char + 'folder=' + directoryName, []).toPromise());
    if (!status.success) {
      this.setError('Error con la creación de la carpeta');
    } else {
      this.setContent(status);
    };
  };

  async uploadFile(formData: FormData, options: Object, path: string): Promise <void> {
    const status = this.parse(await this.http.post<any>(path, formData, options).toPromise());
    if (!status.success) {
      this.setError('Error con la subida del archivo');
    } else {
      this.setContent(status);
    };
  };

  getFile(path: string, file: string): string {
    let char = this.setParameterChar(path);
    if (path == 'http://localhost:3001/') {
      return path.split('?').join('download?') + 'download' + char + 'download=' + file;
    } else {
      return path.split('?').join('download?') + char + 'download=' + file;
    }
  };
  
  parse(request: any): any {
    return JSON.parse(JSON.stringify(request));
  };

  setParameterChar(path: string): string {
    if (path.includes('?')) {
      return '&' as string;
    } else {
      return '?' as string;
    };
  };

  getContent(): Object {
    return this.content;
  };

  setContent(content: Object): void {
    this.content = content;
  };

  getError(): string {
    return this.error;
  };

  setError(error: string): void {
    this.error = error;
  };
};
