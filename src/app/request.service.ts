import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RequestService {
  private data: any;
  constructor(private http: HttpClient) {}

  async getWorkspace() {
    this.setData(await this.http.get('http://localhost:3001').toPromise())
    return this.getData();
  }

  setData(request: any): void {
    this.data = JSON.stringify(request)
    this.data = JSON.parse(this.data)
  }

  getData(): Object {
    return this.data;
  }

}
