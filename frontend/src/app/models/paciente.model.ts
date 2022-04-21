import { Accion } from "./accion.model";

export class Paciente {

    constructor( public uid: number,
                 public descripcion: string,
                 public camina: boolean,
                 public color: string,
                 public acciones: Accion,
                 public empeora: boolean,
                 public tiempoEmpeora?: number) {}
  }