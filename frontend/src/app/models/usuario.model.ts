import { Curso } from './curso.model';

export class Usuario {

    constructor( public uid: number,
                 public rol: string,
                 public activo?: boolean,
                 public nombre?: string,
                 public apellidos?: string,
                 public email?: string,
                 public curso?: Curso,
                 public alta?: Date,
                 public _id?: number) {}
}
