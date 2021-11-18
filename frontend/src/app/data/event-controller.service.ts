import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventControllerService {

  eventEmitterFunction = new EventEmitter();
  constructor() { }

  // Con esta funcion en un string el mensaje y el destinatario
  emitir(mensaje:string, destinatario:string) {
    const data = { mensaje, destinatario};
    this.eventEmitterFunction.emit(JSON.stringify(data));
  }
}
