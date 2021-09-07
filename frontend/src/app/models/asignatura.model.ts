
export class Asignatura {

  constructor( public uid: string,
    public nombre: string,
    public nombrecorto: string,
    public curso: string,
    public profesores: Array<String>,
    public alumnos: Array<String>) {}
}
