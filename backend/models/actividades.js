const { Schema, model } = require('mongoose');

const ActividadSchema = Schema({
    nombre: {
        type: String,
        require: true,
        unique: false
    },
    tiempo: {
        type: Number,
        require: true,
    },
    momento: {
        type: String,
        require: true
    },
    ejercicioUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'EjerciciosUsuario',
        require: true
    },
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente'
    },
    color: {
        type: String
    },
    accion: {
        type: Schema.Types.ObjectId,
        ref: 'Accion'
    },
    
}, { collection: 'actividades' });

ActividadSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Actividad', ActividadSchema);