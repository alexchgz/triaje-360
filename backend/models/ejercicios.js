const { Schema, model } = require('mongoose');

// Definimos Schema de Ejercicio
const EjercicioSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    descripcion: {
        type: String,
        require: true
    },
    asignatura: {
        type: Schema.Types.ObjectId,
        ref: 'Asignatura',
        require: true
    }
}, { collection: 'ejercicios' });

// Modificamos Schema para que no aparezcan todos los datos
EjercicioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

// Exportamos el modelo
module.exports = model('Ejercicio', EjercicioSchema);