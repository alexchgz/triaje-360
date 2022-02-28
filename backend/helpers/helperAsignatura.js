//Promesa si va bien devuelve resolve si va mal devuelve rejectconst 
const Asignatura = require('../models/asignaturas');
const { deleteEjercicio } = require('./deleteEjercicio');

// eliminar curso, comprobando si tiene una asignatura asociada
//si la tiene, eliminar la asignatura
const helperAsignatura = async(idCurso) => {

    const uid = idCurso;
    // console.log('idC:', uid);

    try {

        // buscamos las asignaturas asociadas al curso
        const a = await Asignatura.find({
            curso: uid
        });

        console.log('A:', a);

        // si se encuentran asignaturas borramos los ejercicios de las mismas
        if(a.length > 0) {
            for(let i=0; i<a.length; i++) {
                if(a[i].ejercicios.length > 0) {
                    for(let j=0; j<a[i].ejercicios.length; j++) {
                        deleteEjercicio(a[i].ejercicios[j].ejercicio).then(borrarEjercicio => {
                            console.log('Ejercicio eliminado:', borrarEjercicio);
                        });
                    }
                }
            }
        }

        // Lo eliminamos y devolvemos la asignatura eliminada
        const resultado = await Asignatura.deleteMany({
            curso: uid
        });

        return true;
    } catch (error) {
        console.log(error);
        return false;

    }


}
module.exports = { helperAsignatura }