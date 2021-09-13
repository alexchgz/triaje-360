import { Usuario } from './usuario.model';

export class Profesor {

  constructor( public uid: number,
               public profesores: Array< { usuario: Usuario, _id: number } >) {}
}
