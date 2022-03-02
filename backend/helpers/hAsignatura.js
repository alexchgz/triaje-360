//Promesa si va bien devuelve resolve si va mal devuelve rejectconst 
const Asignatura = require('../models/asignaturas');
const Ejercicio = require('../models/ejercicios');
const Usuario = require('../models/usuarios');
const { deleteEjercicio } = require('./hEjercicio');

// eliminar curso, comprobando si tiene una asignatura asociada
//si la tiene, eliminar la asignatura
const deleteAsignatura = async(idCurso) => {

    const uid = idCurso;

    try {

        // buscamos las asignaturas asociadas al curso
        const a = await Asignatura.find({
            curso: uid
        });

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
const updateAsignatura = async(id, rol, ejercicio) => {

    const uid = id;

    try {

        // Comprobamos si existe el item que queremos borrar y si es un ejercicio o un usuario
        const existeEjercicio = await Ejercicio.findById(uid);
        const existeUsuario = await Usuario.findById(uid);
        const existeAsignatura = await Asignatura.findById(uid);
        
        if (!existeEjercicio && !existeUsuario && !existeAsignatura) {
            return false;
        }

        // si es un usuario
        if(existeUsuario) {
            if(rol == 'ROL_ALUMNO') {
                // buscamos las asignaturas asociadas al usuario
                const resultado = await Asignatura.updateMany(
                    { 'alumnos.usuario': uid },
                    {
                        $pull: { 'alumnos': { 'usuario': uid } }
                    }
                );
                console.log('res:', resultado);
            } else if(rol == 'ROL_PROFESOR') {
                // buscamos las asignaturas asociadas al usuario
                const resultado = await Asignatura.updateMany(
                    { 'profesores.usuario': uid },
                    {
                        $pull: { 'profesores': { 'usuario': uid } }
                    }
                );
                console.log('res:', resultado);
            }
        }

        // si es un ejercicio
        else if(existeEjercicio) {
            const resultado = await Asignatura.updateMany(
                { 'ejercicios.ejercicio': uid },
                {
                    $pull: { 'ejercicios': { 'ejercicio': uid } }
                }
            );
            console.log('res:', resultado);
        }

        // si es una asignatura
        else if(existeAsignatura) {
            if(ejercicio) {
                const resultado = await Asignatura.updateOne(
                    { _id: uid },
                    { $push: { 'ejercicios': ejercicio }}
                );
                console.log('res:', resultado);
            }
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;

    }


}

module.exports = { deleteAsignatura, updateAsignatura }