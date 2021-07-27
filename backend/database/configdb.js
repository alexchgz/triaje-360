// CARGARMOS EL MODULO
const mongoose = require('mongoose');

// CREAMOS OBJETO DE CONEXION
const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD');
    }
}

// EXPORTAMOS EL MODULO
module.exports = { dbConnection };