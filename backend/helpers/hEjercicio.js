//Promesa si va bien devuelve resolve si va mal devuelve rejectconst 
const Ejercicio = require('../models/ejercicios');
const { deleteEjerciciosUsuario } = require('./hEjerciciosUsuario');
const { EjerciciosUsuario } = require('../models/ejerciciosUsuario');

// eliminar producto, comprobando si tiene una oferta asociada
//si la tiene, quitar la oferta al usuario, eliminar la oferta y eliminar el producto
const deleteEjercicio = async(idEjercicio) => {

    const uid = idEjercicio;
    // console.log('idE:', uid);

    try {
        // Comprobamos si existe el item que queremos borrar
        const existeEjercicio = await Ejercicio.findById(uid);
        if (!existeEjercicio) {
            return false;
        }
        //si existe el ejercicio, comprobar si tiene registros asociados para eliminarlos previamente
        deleteEjerciciosUsuario(uid).then(borrarEjerciciosUsuario => {
            console.log('Ejercicios Usuario eliminados:', borrarEjerciciosUsuario);
        });
        

        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Ejercicio.findByIdAndRemove(uid);

        return true;
    } catch (error) {
        console.log(error);
        return false;

    }


}
module.exports = { deleteEjercicio }