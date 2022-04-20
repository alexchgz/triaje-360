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
        type: string,
        require: true,
    },
    img: {
        type: string,
        require: true,
    },
    acciones: [{
        accion: {
            type: Schema.Types.ObjectId,
            ref: 'Accion'
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