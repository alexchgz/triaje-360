import { Usuario } from './usuario.model';
import { Curso } from './curso.model';
import { Profesor } from './profesor.model';
import { Ejercicio } from './ejercicio.model';

export class Asignatura {

  constructor( public uid: number,
    public nombre: string,
    public nombrecorto: string,
    public codigo: string,
    public curso: Curso,
    // public profesores: Array<Profesor>,
    public profesores: Array< { usuario: Usuario, _id: number } >,
    public alumnos: Array< { usuario: Usuario, _id: number } >,
    public ejercicios: Array< { ejercicio: Ejercicio, _id: number } >,
    public _id?: number) {}
}
