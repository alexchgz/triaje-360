const { Schema, model } = require('mongoose');

const PacienteSchema = Schema({
    descripcion: {
        type: String,
        require: true,
    },
    camina: {
        type: Boolean,
        require: true,
        default: true
    },
    color: {
        type: String,
        require: true,
    },
    img: {
        type: String,
        require: true,
    },
    acciones: [{
        accion: {
            nombre: String,
            tiempo: Number
        }
    }],
    empeora: {
        type: Boolean,
        require: true,
        default: false
    },
    tiempoEmpeora: {
        type: Number
    },
}, { collection: 'pacientes' });

PacienteSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Paciente', PacienteSchema);