const { Schema, model } = require('mongoose');

const ImagenSchema = Schema({
    nombre: {
        type: String,
        require: true,
        unique: true
    },
    descripcion: {
        type: String,
        require: true,
    },
    ruta: {
        type: String,
        require: true,
    }
}, { collection: 'imagenes' });

ImagenSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Imagen', ImagenSchema);