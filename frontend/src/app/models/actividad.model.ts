import ejerciciosUsuario from "../../../../backend/models/ejerciciosUsuario";
import { EjerciciosUsuario } from './ejerciciosUsuario.model';

export class Actividad {

    constructor( public uid: number,
                 public nombre: string,
                 public tiempo: number,
                 public momento: string,
                 public ejercicioUsuario: EjerciciosUsuario) {}
  }