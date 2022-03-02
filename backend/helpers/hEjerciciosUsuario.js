//Promesa si va bien devuelve resolve si va mal devuelve rejectconst 
const EjerciciosUsuario = require('../models/ejerciciosUsuario');
const Ejercicio = require('../models/ejercicios');
const Usuario = require('../models/usuarios');

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

        // console.log('REG:', registros);
        if(registros.length > 0) {
            for(let i=0; i<registros.length;i++) {
                await EjerciciosUsuario.findByIdAndRemove(registros[i]._id);
            }
        }
    
        // Lo eliminamos y devolvemos el registro recien eliminado
        // const resultado = await EjerciciosUsuario.findByIdAndRemove(uid);

        return true;
    } catch (error) {
        console.log(error);
        return false;

    }


}
module.exports = { deleteEjerciciosUsuario }