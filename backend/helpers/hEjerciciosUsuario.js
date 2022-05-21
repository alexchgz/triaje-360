const EjerciciosUsuario = require('../models/ejerciciosUsuario');
const Ejercicio = require('../models/ejercicios');
const Usuario = require('../models/usuarios');

// eliminar registro
const updateEjerciciosUsuario = async(idEjercicioUsuario, tiempo) => {

    const uid = idEjercicioUsuario;

    try {
        // Comprobamos si existe el item que queremos borrar y si es un ejercicio o un usuario
        const existeEjercicioUsuario = await EjerciciosUsuario.findById(uid);
        
        if (!existeEjercicioUsuario) {
            return false;
        }

        const resultado = await EjerciciosUsuario.updateOne(
            { _id: uid },
            { 
                $set: { 
                    "fecha_fin": new Date(),
                    "tiempoTotal": tiempo 
                } 
            }
        );

        return resultado;

    } catch (error) {
        console.log(error);
        return false;

    }


}

// eliminar registro
const deleteEjerciciosUsuario = async(id) => {

    const uid = id;

    try {
        // Comprobamos si existe el item que queremos borrar y si es un ejercicio o un usuario
        const existeEjercicio = await Ejercicio.findById(uid);
        const existeUsuario = await Usuario.findById(uid);
        
        if (!existeEjercicio && !existeUsuario) {
            return false;
        }


        let registros = [];
        if(existeEjercicio) {
            // buscamos los registros que coincidan con el ejercicio
            registros = await EjerciciosUsuario.find({
                idEjercicio: uid
            });
        } else if(existeUsuario) {
            registros = await EjerciciosUsuario.find({
                idUsuario: uid
            });
        }

        if(registros.length > 0) {
            for(let i=0; i<registros.length;i++) {
                await EjerciciosUsuario.findByIdAndRemove(registros[i]._id);
            }
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;

    }


}
module.exports = { deleteEjerciciosUsuario, updateEjerciciosUsuario }