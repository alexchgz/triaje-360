
export class Usuario {

    constructor( public uid: number,
                 public rol: string,
                 public activo?: boolean,
                 public nombre?: string,
                 public apellidos?: string,
                 public email?: string,
                 public alta?: Date,
                 public _id?: number) {}
}
