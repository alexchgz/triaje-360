import { Usuario } from './usuario.model';
import { Ejercicio } from './ejercicio.model';

export class EjerciciosUsuario {

  constructor( public uid: number,
               public idUsuario: number,
               public idEjercicio: number,
               public fechaEjecucion: string) {}
}
