const { Schema, model } = require('mongoose');

// Definimos Schema de Asignatura
const AsignaturaSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    nombrecorto: {
        type: String,
        require: true
    },
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        require: true
    },
    profesores: [{
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    }]
}, { collection: 'asignaturas' });

// Modificamos Schema para que no aparezcan todos los datos
AsignaturaSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

// Exportamos el modelo
module.exports = model('Asignatura', AsignaturaSchema);