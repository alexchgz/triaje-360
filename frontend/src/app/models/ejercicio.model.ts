import { Asignatura } from './asignatura.model';

export class Ejercicio {

  constructor( public uid: number,
               public nombre: string,
               public descripcion: string,
               public desde: string,
               public hasta: string,
               public asignatura: Asignatura,
               public max_intentos: number) {}
}
