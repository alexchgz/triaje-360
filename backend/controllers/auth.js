const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

// declaramos funcioan para el login
const login = async(req, res = response) => {

    // obtenemos el email y la password
    const { email, password } = req.body;

    try {
        // verificamos que el email existe en la BD
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        // comprobamos que las password están relacionadas
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        // generemos el JWT
        const token = await generarJWT(usuario._id, usuario.rol);

        res.json({
            ok: true,
            msg: 'login',
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }
}

module.exports = { login };