import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class RequestService {
  private data: any;
  constructor(private http: HttpClient) {}

  async getWorkspace(path: string): Promise <Object> {
    this.setData(await this.http.get(path).toPromise())
    return this.getData();
  }

  async deleteFile(path: string, file: string): Promise <void> {
    let parameter = '?';
    if (path.includes('?')) {
      parameter = '&';
    }
    const a = await this.http.delete(path + parameter  +'file=' + file).toPromise()
    console.log(a);
  }

  setData(request: any): void {
    this.data = JSON.stringify(request)
    this.data = JSON.parse(this.data)
  }

  getData(): Object {
    return this.data;
  }

}
