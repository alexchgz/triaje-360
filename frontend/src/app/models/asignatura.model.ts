import { Usuario } from './usuario.model';
import { Curso } from './curso.model';
import { Profesor } from './profesor.model';

export class Asignatura {

  constructor( public uid: number,
    public nombre: string,
    public nombrecorto: string,
    public curso: Curso,
    // public profesores: Array<Profesor>,
    public profesores: Array< { usuario: Usuario, _id: number } >,
    public alumnos: Array< { usuario: Usuario, _id: number } >,
    public _id?: number) {}
}
