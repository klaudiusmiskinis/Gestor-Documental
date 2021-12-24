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
    this.setContent(this.parse(await this.http.get(path).toPromise()))
    return this.getContent();
  }

  async deleteFile(path: string, file: string): Promise <void> {
    let parameter = '?';
    if (path.includes('?')) {
      parameter = '&';
    }
    const request = await this.http.delete(path + parameter + 'file=' + file).toPromise();
    if (this.parse(request).success) {
      this.setContent(request);
    } else {
      this.setError('Ha habido un error eliminando el archivo.')
    }
  }

  parse(request: any): any {
    return JSON.parse(JSON.stringify(request));
  }

  async postFile(formData: FormData, options: Object, path: string): Promise <void>  {
    const status = this.parse(await this.http.post(path, formData, options).toPromise());
    if (!status.success) {
      this.setError('Error con la subida del archivo');
    }
  }

  getContent(): Object {
    return this.content;
  }

  setContent(content: any): void {
    this.content = content;
  }

  getError(): string {
    return this.error;
  }

  setError(error: string): void {
    this.error = error;
  }

}
