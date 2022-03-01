//Promesa si va bien devuelve resolve si va mal devuelve rejectconst 
const Asignatura = require('../models/asignaturas');
const { deleteEjercicio } = require('./hEjercicio');

// eliminar curso, comprobando si tiene una asignatura asociada
//si la tiene, eliminar la asignatura
const deleteAsignatura = async(idCurso) => {

    const uid = idCurso;
    // console.log('idC:', uid);

    try {

        // buscamos las asignaturas asociadas al curso
        const a = await Asignatura.find({
            curso: uid
        });

        // console.log('A:', a);

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

// actualizar asignaturas en las que estuvieran el usuario/ejercicio
const updateAsignatura = async(idUsuario, rol) => {

    const uid = idUsuario;
    // console.log('idC:', uid);

    try {
        let asignaturasUsuario = [];
        if(rol == 'ROL_ALUMNO') {
            // buscamos las asignaturas asociadas al usuario
            asignaturasUsuario = await Asignatura.find({
                'alumnos.usuario': uid
            });
            console.log('A:', asignaturasUsuario);

            if(asignaturasUsuario.length > 0) {
                await Asignatura.updateMany(
                    { 'alumnos.usuario': uid },
                    {
                        $pull: { 'alumnos': { 'usuario': uid } }
                    }
                );
            }

            // COMPROBACION
            asignaturasUsuario = await Asignatura.find({
                'alumnos.usuario': uid
            });
            console.log('A2:', asignaturasUsuario);
        }


        // si se encuentran asignaturas borramos los ejercicios de las mismas
        // if(a.length > 0) {
        //     for(let i=0; i<a.length; i++) {
        //         if(a[i].ejercicios.length > 0) {
        //             for(let j=0; j<a[i].ejercicios.length; j++) {
        //                 deleteEjercicio(a[i].ejercicios[j].ejercicio).then(borrarEjercicio => {
        //                     console.log('Ejercicio eliminado:', borrarEjercicio);
        //                 });
        //             }
        //         }
        //     }
        // }

        // Lo eliminamos y devolvemos la asignatura eliminada
        // const resultado = await Asignatura.deleteMany({
        //     curso: uid
        // });

        return true;
    } catch (error) {
        console.log(error);
        return false;

    }


}

module.exports = { deleteAsignatura, updateAsignatura }