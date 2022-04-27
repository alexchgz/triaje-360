const { Schema, model } = require('mongoose');

const ImagenPacienteSchema = Schema({
    nombre: {
        type: String,
        require: true,
        unique: true
    },
    ruta: {
        type: String,
        require: true,
    }
}, { collection: 'imagenesPaciente' });

ImagenPacienteSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('ImagenPaciente', ImagenPacienteSchema);