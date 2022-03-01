//Promesa si va bien devuelve resolve si va mal devuelve rejectconst 
const EjerciciosUsuario = require('../models/ejerciciosUsuario');
const Ejercicio = require('../models/ejercicios');

// eliminar registro
const deleteEjerciciosUsuario = async(idEjercicio) => {

    const uid = idEjercicio;

    try {
        // Comprobamos si existe el item que queremos borrar
        const existeEjercicio = await Ejercicio.findById(uid);
        if (!existeEjercicio) {
            return false;
        }

        // buscamos los registros que coincidan con el ejercicio
        const registros = await EjerciciosUsuario.find({
            idEjercicio: uid
        });
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