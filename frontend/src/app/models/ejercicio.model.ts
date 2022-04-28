import { Asignatura } from './asignatura.model';
import { Imagen } from './imagen.model';
import { Paciente } from './paciente.model';

export class Ejercicio {

  constructor( public uid: number,
               public nombre: string,
               public descripcion: string,
               public desde: string,
               public hasta: string,
               public asignatura: Asignatura,
               public max_intentos: number,
               public imgs: Array< { img: Imagen, _id: number } >,
               public pacientes: Array< { paciente: Paciente, _id: number } >) {}
}
