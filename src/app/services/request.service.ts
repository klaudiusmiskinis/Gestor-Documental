import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Person } from '../models/persons';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })

export class RequestService {
  private content: any;
  private notifier: any;
  constructor(private http: HttpClient, notifier: NotifierService, private token: TokenService, private router: Router) {
    this.notifier = notifier;
  }

  /**
   * POST a backend para la ruta login
   * @param user object
   * @returns Object
   */
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

  /**
  * GET a backend para la ruta getAllFiles
  * @param user object
  * @returns Object
  */
  async getAllFiles() {
    try {
      return await this.http.get<any>('http://localhost:3001/getAllFiles').toPromise();
    } catch (e) {
      this.notificate('Error con el servidor.');
      return 'Error';
    }
  }

  /**
   * GET a backend para la ruta isAuthenticated
   */
  async isAuthenticated() {
    try {
      return await this.http.get<any>('http://localhost:3001/isAuthenticated').toPromise();
    } catch (e) {
      this.notificate('No tienes permiso para acceder aquí.');
    }
  }

  /**
   * GET para los datos dependiendo de la carpeta en la que nos encontremos
   * @param user object
   * @returns Object
   */
  async getWorkspace(path: string): Promise<Object> {
    try {
      this.setContent(this.parse(await this.http.get<any>(path).toPromise()));
      return this.getContent();
    } catch (e) {
      this.notificate('Error con el servidor.');
      return 'Error';
    }
  };

  /**
   * DELETE para eliminar un archivo
   * @param path string
   * @param file string
   */
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

  /**
   * DELETE para eliminar una carpeta
   * @param path string
   * @param folder string
   */
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

  /**
   * POST para recuperar un archivo
   * @param path string
   * @param folder string
   */
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

  /**
   * POST para crear una carpeta
   * @param path string
   * @param directoryName string
   */
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

  /**
   * GET a la ruta persons
   * @returns array
   */
  async getPersons() {
    const response = await this.http.get<any>('http://localhost:3001/persons').toPromise();
    return response;
  }

  /**
   * POST que envia el archivo al backend y los datos referentes a la subida
   * @param formData FormData
   * @param options Object
   * @param path string
   * @param name string
   * @param fileRelated string
   * @param fileReason string
   * @param author string
   */
  async uploadFile(formData: FormData, options: Object, path: string, name: string, fileRelated: string, fileReason: string, author: string): Promise<void> {
    try {
      if (name) path = path + this.setParameterChar(path) + 'updateName=' + name;
      if (fileRelated !== undefined) path = path + this.setParameterChar(path) + 'fileRelated=' + fileRelated;
      if (fileReason && fileReason.length > 5) path = path + this.setParameterChar(path) + 'reason=' + fileReason;
      if (author) path = path + this.setParameterChar(path) + 'author=' + author;
      const status = this.parse(await this.http.post<any>(path, formData, options).toPromise());
      if (status.success) {
        this.notificate('¡Archivo subido!');
        this.setContent(status);
      };
    } catch (e) {
      this.notificate('Error con la subida del archivo.');
    }
  };

  /**
   * POST para editar el nombre
   * @param path string
   * @param newName string
   * @param oldName string
   */
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

  /**
   * POST que actualiza los datos de la fila
   * @param data any
   * @returns boolean
   */
  async updateRow(data: any): Promise<boolean> {
    try {
      await this.http.post<any>('http://localhost:3001/update', data).toPromise();
      return true;
    } catch (e) {
      this.notificate('Error con el cambio de nombre');
      return false;
    }
  }

  /**
   * Devuelve el archivo para descargar
   * @param path string
   * @param file string
   * @returns string
   */
  getFile(path: string, file: string): string {
    let char = this.setParameterChar(path);
    if (path == 'http://localhost:3001/') {
      return path.split('?').join('download?') + 'download' + char + 'download=' + file;
    } else {
      return path.split('?').join('download?') + char + 'download=' + file;
    }
  };

  /**
   * Devuelve el archivo para descargar
   * @param path string
   * @param file string
   * @returns string
   */
  getPDF(path: string, file: string): string {
    let char = this.setParameterChar(path);
    if (path == 'http://localhost:3001/') {
      return path.split('?').join('download/pdf?') + 'download/pdf' + char + 'download=' + file;
    } else {
      return path.split('?').join('download/pdf?') + char + 'download=' + file;
    }
  };

  /**
   * Convierte JSON a Nomenclatura de JavaScript
   * @param request 
   * @returns 
   */
  parse(request: any): any {
    return JSON.parse(JSON.stringify(request));
  };

  /**
   * Comprueba el parametro y devuleve & o ?
   * @param path string
   * @returns 
   */
  setParameterChar(path: string): string {
    if (path.includes('?')) {
      return '&' as string;
    } else {
      return '?' as string;
    };
  };

  /**
   * Devuleve el contenido
   * @returns Object
   */
  getContent(): Object {
    return this.content;
  };

  /**
   * Asigna el contenido
   * @param content Object
   */
  setContent(content: Object): void {
    this.content = content;
  };

  /**
   * Crea una notificacion
   * @param message string
   */
  notificate(message: string): void {
    this.notifier.notify('default', message);
  };

  /**
   * Elimina el token del localStorage
   */
  logout() {
    this.token.removeToken()
  }

  /**
   * Redirige a la ruta parametrizada
   * @param path string
   */
  redirectTo(path: string) {
    if (path.charAt(0) !== '/') path = '/' + path;
    this.router.navigate([path])
  }
};
