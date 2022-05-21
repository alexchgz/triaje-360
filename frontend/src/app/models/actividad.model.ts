
export class Actividad {

    constructor( public uid: number,
                 public nombre: string,
                 public tiempo: number,
                 public momento: string,
                 public ejercicioUsuario: number,
                 public paciente?: number) {}
  }