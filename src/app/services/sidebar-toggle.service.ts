import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SidebarToggleService {

  private childEvent = new BehaviorSubject<Boolean>(true);

  childEventEmitter(toggle: Boolean){
    console.log(toggle)
    this.childEvent.next(toggle)
  }

  parentListenerEvent(){
    return this.childEvent.asObservable();
  }
}
