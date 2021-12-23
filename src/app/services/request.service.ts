import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RequestService {
  private data: any;
  constructor(private http: HttpClient) {}

  async getWorkspace(path: string): Promise <Object> {
    this.parseData(await this.http.get(path).toPromise())
    return this.getData();
  }

  async deleteFile(path: string, file: string): Promise <void> {
    let parameter = '?';
    if (path.includes('?')) {
      parameter = '&';
    }
    await this.http.delete(path + parameter  +'file=' + file).toPromise()
  }

  parseData(request: any): void {
    this.data = JSON.stringify(request)
    this.data = JSON.parse(this.data)
  }

  async postFile(formData: FormData, options: Object, path: string): Promise <void>  {
    await this.http.post(path, formData, options).toPromise();
  }

  getData(): Object {
    return this.data;
  }

  setData(data: any): void {
    this.data = data;
  }

}
