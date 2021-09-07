import { Usuario } from './usuario.model';

export class Asignatura {

  constructor( public uid: string,
    public nombre: string,
    public nombrecorto: string,
    public curso: string,
    public profesores: Array<Usuario>,
    public alumnos: Array<Usuario>) {}
}
