const { Schema, model } = require('mongoose');

// Definimos Schema de Usuario
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    apellidos: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    rol: {
        type: String,
        require: true,
        default: 'ROL_ALUMNO'
    },
    activo: {
        type: Boolean,
        default: true
    },
    alta: {
        type: Date,
        default: Date.now
    }
}, { collection: 'usuarios' });

// Modificamos Schema para que no aparezcan todos los datos
UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

// Exportamos el modelo
module.exports = model('Usuario', UsuarioSchema);