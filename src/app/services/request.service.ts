import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })

export class RequestService {
  private content: any;
  private notifier: any;
  constructor(private http: HttpClient, notifier: NotifierService, private token: TokenService, private router: Router) {
    this.notifier = notifier;
  }

  async login(user: object): Promise<Object> {
    try {
      const res = await this.http.post<any>('http://localhost:3001/login', user).toPromise();
      this.token.setToken(res.token)
      this.token.saveToken();
      return true;
    } catch (e) {
      this.notificate('Datos incorrectos.');
      return false;
    }
  };

  async getAllFiles() {
    try {
      return await this.http.get<any>('http://localhost:3001/getAllFiles').toPromise();
    } catch (e) {
      this.notificate('Error con el servidor.');
      return 'Error';
    }
  }

  async isAuthenticated() {
    try {
      return await this.http.get<any>('http://localhost:3001/isAuthenticated').toPromise();
    } catch (e) {
      this.notificate('No tienes permiso para acceder aquí.');
    }
  }

  async getWorkspace(path: string): Promise<Object> {
    try {
      this.setContent(this.parse(await this.http.get<any>(path).toPromise()));
      return this.getContent();
    } catch (e) {
      this.notificate('Error con el servidor.');
      return 'Error';
    }
  };

  async deleteFile(path: string, file: string): Promise<void> {
    try {
      let char = this.setParameterChar(path);
      const status = this.parse(await this.http.delete<any>(path + char + 'file=' + file).toPromise());
      if (status.success) {
        this.notificate('¡Archivo eliminado!');
        this.setContent(status);
      }
    } catch (e) {
      this.notificate('Ha habido un error eliminando el archivo.');
    }
  };

  async deleteDirectory(path: string, folder: string): Promise<void> {
    try {
      let char = this.setParameterChar(path);
      const status = this.parse(await this.http.delete<any>(path + char + 'folder=' + folder).toPromise());
      if (status.success) {
        this.notificate('¡Eliminando directorio!');
        this.setContent(status);
      }
    } catch (e) {
      this.notificate('Ha habido un error eliminando el directorio.');
    }
  };

  async recoverFile(id: number, isLastVersion: boolean): Promise<void> {
    try {
      const status = this.parse(await this.http.post<any>('http://localhost:3001/recover', { id: id, isLastVersion: isLastVersion }).toPromise());
      if (status.success) {
        this.notificate('¡Archivo recuperado!');
        this.setContent(status);
      };
    } catch (e) {
      this.notificate('Error con la creación de la carpeta');
    }
  }

  async makeDirectory(path: string, directoryName: string): Promise<void> {
    try {
      let char = this.setParameterChar(path);
      const status = this.parse(await this.http.post<any>(path + char + 'folder=' + directoryName, []).toPromise());
      if (status.success) {
        this.notificate('¡Directorio creado!');
        this.setContent(status);
      };
    } catch (e) {
      this.notificate('Error con la creación de la carpeta');
    }
  };

  async uploadFile(formData: FormData, options: Object, path: string, name: string, fileRelated: string, fileReason: string): Promise<void> {
    try {
      if (name) {
        path = path + this.setParameterChar(path) + 'updateName=' + name;
      } if (fileRelated !== undefined) {
        path = path + this.setParameterChar(path) + 'fileRelated=' + fileRelated;
      } if (fileReason && fileReason.length > 5) {
        path = path + this.setParameterChar(path) + 'reason=' + fileReason;
      }
      const status = this.parse(await this.http.post<any>(path, formData, options).toPromise());
      if (status.success) {
        this.notificate('¡Archivo subido!');
        this.setContent(status);
      };
    } catch (e) {
      console.log(e);
      this.notificate('Error con la subida del archivo.');
    }
  };

  async editElementName(path: string, newName: string, oldName: string): Promise<void> {
    try {
      path = path + this.setParameterChar(path) + 'edit=' + oldName + '&to=' + newName;
      const status = this.parse(await this.http.post<any>(path, []).toPromise());
      if (status.success) {
        this.setContent(status);
      }
    } catch (e) {
      this.notificate('Error con el cambio de nombre');
    }
  }

  async updateRow(data: any): Promise<void> {
    try {
      const status = this.parse(await this.http.post<any>('http://localhost:3001/updateRow', data).toPromise());
      if (status.success) {
        this.setContent(status);
      }
    } catch (e) {
      this.notificate('Error con el cambio de nombre');
    }
  }

  getFile(path: string, file: string): string {
    let char = this.setParameterChar(path);
    if (path == 'http://localhost:3001/') {
      return path.split('?').join('download?') + 'download' + char + 'download=' + file;
    } else {
      return path.split('?').join('download?') + char + 'download=' + file;
    }
  };

  getPDF(path: string, file: string): string {
    let char = this.setParameterChar(path);
    if (path == 'http://localhost:3001/') {
      return path.split('?').join('download/pdf?') + 'download/pdf' + char + 'download=' + file;
    } else {
      return path.split('?').join('download/pdf?') + char + 'download=' + file;
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

  notificate(message: string): void {
    this.notifier.notify('default', message);
  };

  logout() {
    this.token.removeToken()

  }

  redirectTo(path: string) {
    if (path.charAt(0) !== '/') path = '/' + path;
    this.router.navigate([path])
  }
};
