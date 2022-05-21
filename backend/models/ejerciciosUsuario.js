const { Schema, model } = require('mongoose');

// Definimos Schema de Ejercicio
const EjerciciosUsuarioSchema = Schema({
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },
    idEjercicio: {
        type: Schema.Types.ObjectId,
        ref: 'Ejercicio',
        require: true
    },
    fecha_ejecucion: {
        type: Date,
        default: Date.now
    },
    fecha_fin: {
        type: Date
    },
    tiempoTotal: {
        type: String
    }
}, { collection: 'ejerciciosUsuario' });

// Modificamos Schema para que no aparezcan todos los datos
EjerciciosUsuarioSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

// Exportamos el modelo
module.exports = model('EjerciciosUsuario', EjerciciosUsuarioSchema);