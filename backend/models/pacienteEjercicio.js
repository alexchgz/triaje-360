const { Schema, model } = require('mongoose');

// Definimos Schema de Ejercicio
const PacienteEjercicioSchema = Schema({
    idPaciente: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente',
        require: true
    },
    idEjercicio: {
        type: Schema.Types.ObjectId,
        ref: 'Ejercicio',
        require: true
    },
    idImagen: {
        type: Schema.Types.ObjectId,
        ref: 'Imagen',
        require: true
    },
    x: {
        type: Number,
        require: true
    },
    y: {
        type: Number,
        require: true
    }
}, { collection: 'pacienteEjercicio' });

// Modificamos Schema para que no aparezcan todos los datos
PacienteEjercicioSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

// Exportamos el modelo
module.exports = model('PacienteEjercicio', PacienteEjercicioSchema);