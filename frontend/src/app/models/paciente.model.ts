import { Accion } from "./accion.model";

export class Paciente {

    constructor( public uid: number,
                 public descripcion: string,
                 public camina: boolean,
                 public color: string,
                 public acciones: Array< { accion: Accion, _id: number } >,
                 public img: string,
                 public empeora: boolean,
                 public tiempoEmpeora: number) {}
  }