import { Usuario } from './usuario.model';
import { Curso } from './curso.model';

export class Asignatura {

  constructor( public uid: number,
    public nombre: string,
    public nombrecorto: string,
    public curso: Curso,
    public profesores: Array< { usuario: Usuario, _id: number } >,
    public alumnos: Array<Usuario>) {}
}
