const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');

// funcion para comprobar token
const token = async(req, res = response) => {

    const token = req.headers['x-token'];

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Token no válido',
                token: ''
            });
        }
        const rolBD = usuarioBD.rol;

        const nuevoToken = await generarJWT(uid, rol);

        res.json({
            ok: true,
            msg: 'Token',
            uid: uid,
            nombre: usuarioBD.nombre,
            apellidos: usuarioBD.apellidos,
            email: usuarioBD.email,
            rol: rolBD,
            alta: usuarioBD.alta,
            activo: usuarioBD.activo,
            token: nuevoToken
        });
    } catch {
        return res.status(400).json({
            ok: false,
            msg: 'Token no válido',

            token: ''
        });
    }
}

// declaramos funcion para el login
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
            rol: usuario.rol,
            id: usuario.id,
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

module.exports = { login, token };