const Usuario = require('../models/usuarios');
const { response } = require('express');

const initDB = async() => {
    try {
        [usuarios] = await Promise.all([
            // consulta para obtener el numero total de usuarios
            Usuario.countDocuments()
        ]);

        // console.log(usuarios);

        if (usuarios == 0) {
            var defaultUser = new Usuario({
                nombre: 'Admin',
                apellidos: 'Default',
                email: 'default@gmail.com',
                password: '$2a$10$wt/RHChi6M4ZR.FtIAHAZeYDTKFzFrInyh3jXvy0H/KeaXipMdeme',
                rol: 'ROL_ADMIN',
                activo: true
            });

            await defaultUser.save();
            console.log('Se ha creado Usuario por Defecto con Email: default@ua.es y Contraseña: 1234');
        }
    } catch (error) {
        console.log(error);
        throw new Error('Error al crear usuario por defecto');
    }
}
module.exports = { initDB }