//Promesa si va bien devuelve resolve si va mal devuelve rejectconst 
const EjerciciosUsuario = require('../models/ejerciciosUsuario');

// eliminar producto, comprobando si tiene una oferta asociada
//si la tiene, quitar la oferta al usuario, eliminar la oferta y eliminar el producto
const deleteEjerciciosUsuario = async(idEjercicioUsuario) => {

    const uid = idEjercicioUsuario;

    try {
        // Comprobamos si existe el item que queremos borrar
        const existeEjercicioUsuario = await EjerciciosUsuario.findById(uid);
        if (!existeEjercicioUsuario) {
            return false;
        }
    
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await EjerciciosUsuario.findByIdAndRemove(uid);

        return true;
    } catch (error) {
        console.log(error);
        return false;

    }


}
module.exports = { deleteEjerciciosUsuario }