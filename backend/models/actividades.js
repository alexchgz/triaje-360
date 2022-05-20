const { Schema, model } = require('mongoose');

const ActividadSchema = Schema({
    nombre: {
        type: String,
        require: true,
        unique: true
    },
    tiempo: {
        type: Number,
        require: true,
    },
    momento: {
        type: Date,
        require: true
    },
    ejercicioUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'EjerciciosUsuario',
        require: true
    }
    
}, { collection: 'actividades' });

ActividadSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Actividad', ActividadSchema);