const Usuario = require('../models/usuarios');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { infoToken } = require('../helpers/infotoken');
const { deleteEjerciciosUsuario } = require('../helpers/hEjerciciosUsuario');
const { updateAsignatura } = require('../helpers/hAsignatura');

const getUsuarios = async(req, res) => {

    // parametros
    const id = req.query.id;
    const currentPage = Number(req.query.currentPage);
    const pageSize = Number(req.query.pageSize);
    const desde = (currentPage - 1) * pageSize;
    const role = req.query.role;

    const idsUsuAsignados = req.query.idsUsuAsignados;
    if(idsUsuAsignados) {
        var ids = [];

        ids = idsUsuAsignados.split(",");
        for (let i = 0; i < ids.length; i++) {
                ids[i] = ids[i].trim();
        }
    }

    // preparamos texto para buscar
    let texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }

    // Solo puede obtener usuarios un admin
    const token = req.header('x-token');
    // pueden obtener usuarios admin y profesores
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener usuarios',
        });
    }

    try {
        var usuarios, totalUsuarios,
        usuariosAsignados, usuariosNoAsignados; // variables para la búsqueda en gestion de asignaturas

        if (id) { // si nos pasan un id
            [usuarios, totalUsuarios] = await Promise.all([
                Usuario.findById(id).populate('curso', '-__v'),
                Usuario.countDocuments()
            ]);

        } else { // si no nos pasan el id

            if (texto != undefined) {

                if (!role) {
                    [usuarios, totalUsuarios] = await Promise.all([
                        Usuario.find({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre apellidos email rol curso activo').skip(desde).limit(pageSize).populate('curso', '-__v'),
                        Usuario.countDocuments({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] })
                    ]);
                } else {
                    if(!idsUsuAsignados) {
                        [usuarios, totalUsuarios] = await Promise.all([
                            Usuario.find({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }], rol: role }, 'nombre apellidos email rol curso activo').skip(desde).limit(pageSize).populate('curso', '-__v'),
                            Usuario.countDocuments({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }], rol: role })
                        ]);
                    } else {
                        // en este caso -> busqueda de usuarios en gestionar asignatura
                        [usuariosAsignados, usuariosNoAsignados] = await Promise.all([
                            // consulta para usuarios asignados a la asignatura
                            Usuario.find({ rol: role, _id: { $in: ids }, $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre apellidos email rol curso activo')
                            .sort({ apellidos: 1, nombre: 1 })
                            .populate('curso', '-__v'),
                            // consulta para profesores NO asignados a la asignatura
                            Usuario.find({ activo: true, rol: role, _id: { $nin: ids }, $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre apellidos email rol curso activo')
                            .sort({ apellidos: 1, nombre: 1 })
                            .populate('curso', '-__v'),
            
                        ]);
                    }
                }

            } else {

                if (!role) {
                    [usuarios, totalUsuarios] = await Promise.all([
                        Usuario.find({}, 'nombre apellidos email rol curso activo').skip(desde).limit(pageSize).populate('curso', '-__v'),
                        Usuario.countDocuments()
                    ]);
                } else {
                    [usuarios, totalUsuarios] = await Promise.all([
                        Usuario.find({ rol: role }, 'nombre apellidos email rol curso activo').skip(desde).limit(pageSize).populate('curso', '-__v'),
                        Usuario.countDocuments({ rol: role })
                    ]);
                }

            }

        }
        
        res.json({
            ok: true,
            msg: 'Usuarios obtenidos',
            usuarios,
            usuariosAsignados, 
            usuariosNoAsignados,
            totalUsuarios,
            pageSize,
            currentPage,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo usuarios'
        })
    }
}

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear usuarios',
        });
    }

    try {
        // comprobamos si ya existe el correo
        const existeEmail = await Usuario.findOne({ email: email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        // ciframos password
        const salt = bcrypt.genSaltSync(); // generamos salt
        const cpassword = bcrypt.hashSync(password, salt); // ciframos

        // sacamos el campo alta del req.body para que no nos la puedan mandar
        const { alta, ...object } = req.body;

        // creamos el usuario y lo almacenamos los datos en la BBDD
        const usuario = new Usuario(object);
        usuario.password = cpassword;
        await usuario.save();

        res.json({
            ok: true,
            msg: 'Usuario creado',
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
    const { email, password, alta, ...object } = req.body;
    const uid = req.params.id;

    // Solo puede actualizar usuarios un admin
    const token = req.header('x-token');
    
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar usuarios',
        });
    }

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

    // Solo puede borrar usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar usuarios',
        });
    }

    try {
        // en primer lugar comprobamos que exista el usuario
        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        // ANTES DE ELIMINAR AL USUARIO
        // 1. eliminamos registros de ejercicio asociados al usuario
        if(existeUsuario.rol == 'ROL_ALUMNO') {
            await deleteEjerciciosUsuario(existeUsuario._id).then(borrarEjerciciosUsuario => {
                console.log('Ejercicios Usuario eliminados:', borrarEjerciciosUsuario);
            });
        }
        // 2. actualizamos asignatura quitando al usuario
        await updateAsignatura(existeUsuario._id, existeUsuario.rol).then(actualizarAsignaturasUsuario => {
            console.log('Asignaturas Usuario actualizadas:', actualizarAsignaturasUsuario);
        });

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