const Usuario = require('../models/usuarios');
const { response } = require('express');
const bcrypt = require('bcryptjs');

const getUsuarios = async(req, res) => {
    const usuarios = await Usuario.find({});
    res.json({
        ok: true,
        msg: 'getUsuarios',
        usuarios
    });
}

const crearUsuario = async(req, res = response) => {

    const { email, password, rol } = req.body;

    try {
        //comprobamos si ya existe el correo
        const existeEmail = await Usuario.findOne({ email: email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        //ciframos password
        const salt = bcrypt.genSaltSync(); // generamos salt
        const cpassword = bcrypt.hashSync(password, salt); // ciframos

        //almacenamos los datos en la BBDD
        const usuario = new Usuario(req.body);
        usuario.password = cpassword;
        await usuario.save();

        res.json({
            ok: true,
            msg: 'crearUsuario',
            usuario
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear usuario'
        });
    }
}

const actualizarUsuario = async(req, res) => {

    //obtenemos parametros asegurandonos de dejar fuera la password, ya que para modificarla se hace en otra llamada especifica para ello
    const { email, password, ...object } = req.body;
    const uid = req.params.id;

    try {

        // comprobamos si el email que se esta intentando cambiar existe
        const existeEmail = await Usuario.findOne({ email: email });

        if (existeEmail) {
            // si existe, comprobamos que el id coincide para asegurarnos que el email es suyo
            if (existeEmail._id != uid) {
                res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }

        //si está ya y es el suyo o lo está cambiando lo asginamos de nuevo
        object.email = email;
        // actualizamos los datos
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Usuario Actualizado',
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando el usuario'
        });
    }
}

const borrarUsuario = async(req, res) => {

    // obtenemos el id
    const uid = req.params.id;

    try {
        // en primer lugar comprobamos que exista el usuario
        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        // si existe lo eliminamos
        const resultado = await Usuario.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Usuario Eliminado',
            resultado
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error eliminando el usuario'
        });
    }

}

// Exportamos el modulo
module.exports = { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario };