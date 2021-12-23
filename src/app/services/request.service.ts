import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RequestService {
  private data: any;
  constructor(private http: HttpClient) {}

  async getWorkspace(path: string) {
    this.setData(await this.http.get(path).toPromise())
    return this.getData();
  }

  setData(request: any): void {
    this.data = JSON.stringify(request)
    this.data = JSON.parse(this.data)
    console.log(this.data)
  }

  getData(): Object {
    return this.data;
  }

}
