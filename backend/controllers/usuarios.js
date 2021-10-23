const Usuario = require('../models/usuarios');
const { response } = require('express');
const bcrypt = require('bcryptjs');

const { infoToken } = require('../helpers/infotoken');

const getUsuarios = async(req, res) => {

    // parametros para la paginacion ->
    // si no es un numero lo pone a 0
    //const desde = Number(req.query.desde) || 0;
    // cantidad de registros que vamos a mostrar por pagina
    //const registropp = Number(process.env.DOCSPERPAGE);
    const currentPage = Number(req.query.currentPage);
    const pageSize = Number(req.query.pageSize);
    const desde = (currentPage - 1) * pageSize;
    const role = req.query.role;
    // console.log(schoolYear);
    //const schoolYear = "612a911cd5e8413c68f28e14";

    let texto = req.query.texto;
    // console.log(texto);
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }

    // recogemos un parametro para poder buscar tambien por id
    const id = req.query.id;

    // Solo puede obtener usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener usuarios',
        });
    }

    try {
        var usuarios, totalUsuarios;

        if (id) { // si nos pasan un id
            // usamos Promise.all para realizar las consultas de forma paralela
            [usuarios, totalUsuarios] = await Promise.all([
                // buscamos por el id
                Usuario.findById(id).populate('curso', '-__v'),
                // consulta para obtener el numero total de usuarios
                Usuario.countDocuments()
            ]);

        } else { // si no nos pasan el id

            if (texto != undefined) {

                if (role == '' || role == null) {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [usuarios, totalUsuarios] = await Promise.all([
                        // consulta con los parametros establecidos
                        Usuario.find({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre apellidos email rol curso activo').skip(desde).limit(pageSize).populate('curso', '-__v'),
                        // consulta para obtener el numero total de usuarios
                        Usuario.countDocuments({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] })
                    ]);
                } else if (role == null) {
                    [usuarios, totalUsuarios] = await Promise.all([
                        // consulta con los parametros establecidos
                        Usuario.find({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre apellidos email rol curso activo').populate('curso', '-__v'),
                        // consulta para obtener el numero total de usuarios
                        Usuario.countDocuments({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] })
                    ]);
                } else {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [usuarios, totalUsuarios] = await Promise.all([
                        // consulta con los parametros establecidos
                        Usuario.find({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }], rol: role }, 'nombre apellidos email rol curso activo').skip(desde).limit(pageSize).populate('curso', '-__v'),

                        // consulta para obtener el numero total de usuarios
                        Usuario.find({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }], rol: role }).countDocuments()
                        // Usuario.countDocuments({})
                    ]);
                }

            } else {

                if (role == '' || role == null) {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [usuarios, totalUsuarios] = await Promise.all([
                        // consulta con los parametros establecidos
                        Usuario.find({}, 'nombre apellidos email rol curso activo').skip(desde).limit(pageSize).populate('curso', '-__v'),
                        // consulta para obtener el numero total de usuarios
                        Usuario.countDocuments()
                    ]);
                } else if (role == null) {
                    [usuarios, totalUsuarios] = await Promise.all([
                        // consulta con los parametros establecidos
                        Usuario.find({}, 'nombre apellidos email rol curso activo').populate('curso', '-__v'),
                        // consulta para obtener el numero total de usuarios
                        Usuario.countDocuments()
                    ]);
                } else {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [usuarios, totalUsuarios] = await Promise.all([
                        // consulta con los parametros establecidos
                        Usuario.find({ rol: role }, 'nombre apellidos email rol curso activo').skip(desde).limit(pageSize).populate('curso', '-__v'),

                        // consulta para obtener el numero total de usuarios
                        Usuario.find({ rol: role }).countDocuments()
                        // Usuario.countDocuments({})
                    ]);
                }

            }

        }
        // console.log(usuarios);
        res.json({
            ok: true,
            msg: 'Usuarios obtenidos',
            usuarios,
            totalUsuarios,
            pageSize,
            currentPage,
            // recogemos los datos de la página para mostrarlos en la respuesta
            page: {
                desde,
                currentPage,
                totalUsuarios
            }
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo usuarios'
        })
    }
}

const getProfesores = async(req, res) => {

    let texto = req.query.texto;
    // console.log(texto);
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }

    let profesAsignados;
    if (req.query.idProfesores) {
        profesAsignados = req.query.idProfesores;
    }
    // console.log(profesAsignados);
    let ids = [];

    if (profesAsignados) {
        ids = profesAsignados.split(",");

        for (let i = 0; i < ids.length; i++) {
            ids[i] = ids[i].trim();
        }
    }

    // console.log(profesAgregados);
    // console.log(ids);

    try {
        // console.log('entro');
        var profesoresAsignados, profesoresNoAsignados;

        if (texto != undefined) {
            [profesoresAsignados, profesoresNoAsignados] = await Promise.all([
                // consulta para profesores asignados a la asignatura
                Usuario.find({ rol: "ROL_PROFESOR", _id: { $in: ids }, $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre apellidos email rol curso activo')
                .sort({ apellidos: 1, nombre: 1 })
                .populate('curso', '-__v'),
                // consulta para profesores NO asignados a la asignatura
                Usuario.find({ activo: true, rol: "ROL_PROFESOR", _id: { $nin: ids }, $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre apellidos email rol curso activo')
                .sort({ apellidos: 1, nombre: 1 })
                .populate('curso', '-__v'),

            ]);
        } else {
            // usamos Promise.all para realizar las consultas de forma paralela
            [profesoresAsignados, profesoresNoAsignados] = await Promise.all([
                // consulta para profesores asignados a la asignatura
                Usuario.find({ rol: "ROL_PROFESOR", _id: { $in: ids } }, 'nombre apellidos email rol curso activo')
                .sort({ apellidos: 1, nombre: 1 })
                .populate('curso', '-__v'),
                // consulta para profesores NO asignados a la asignatura
                Usuario.find({ activo: true, rol: "ROL_PROFESOR", _id: { $nin: ids } }, 'nombre apellidos email rol curso activo')
                .sort({ apellidos: 1, nombre: 1 })
                .populate('curso', '-__v'),

            ]);
        }


        // console.log(profesoresAsignados);
        // console.log(profesoresNoAsignados);
        // }
        // console.log(usuarios);
        res.json({
            ok: true,
            msg: 'Profesores obtenidos',
            profesoresAsignados,
            profesoresNoAsignados
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo profesores'
        })
    }
}

const getAlumnos = async(req, res) => {

    let texto = req.query.texto;
    // console.log(texto);
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }

    let alumAsignados;
    if (req.query.idAlumnos) {
        alumAsignados = req.query.idAlumnos;
    }
    // console.log(profesAsignados);
    let ids = [];

    if (alumAsignados) {
        ids = alumAsignados.split(",");

        for (let i = 0; i < ids.length; i++) {
            ids[i] = ids[i].trim();
        }
    }

    // Solo puede obtener alumnos un admin o un profesor
    const token = req.header('x-token');
    // lo puede obtener un administrador o un profesor
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener alumnos',
        });
    }

    try {
        var alumnosAsignados, alumnosNoAsignados;

        if (texto != undefined) {
            [alumnosAsignados, alumnosNoAsignados] = await Promise.all([
                // consulta para profesores asignados a la asignatura
                Usuario.find({ activo: true, rol: "ROL_ALUMNO", _id: { $in: ids }, $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre apellidos email rol curso activo')
                .sort({ apellidos: 1, nombre: 1 })
                .populate('curso', '-__v'),
                // consulta para profesores NO asignados a la asignatura
                Usuario.find({ activo: true, rol: "ROL_ALUMNO", _id: { $nin: ids }, $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre apellidos email rol curso activo')
                .sort({ apellidos: 1, nombre: 1 })
                .populate('curso', '-__v'),

            ]);
        } else {
            // usamos Promise.all para realizar las consultas de forma paralela
            [alumnosAsignados, alumnosNoAsignados] = await Promise.all([
                // consulta para profesores asignados a la asignatura
                Usuario.find({ activo: true, rol: "ROL_ALUMNO", _id: { $in: ids } }, 'nombre apellidos email rol curso activo')
                .sort({ apellidos: 1, nombre: 1 })
                .populate('curso', '-__v'),
                // consulta para profesores NO asignados a la asignatura
                Usuario.find({ activo: true, rol: "ROL_ALUMNO", _id: { $nin: ids } }, 'nombre apellidos email rol curso activo')
                .sort({ apellidos: 1, nombre: 1 })
                .populate('curso', '-__v'),

            ]);
        }

        // }
        // console.log(usuarios);
        res.json({
            ok: true,
            msg: 'Alumnos obtenidos',
            alumnosAsignados,
            alumnosNoAsignados
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo alumnos'
        })
    }
}

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
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
    // lo puede actualizar un administrador o el propio usuario del token
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
module.exports = { getUsuarios, getProfesores, getAlumnos, crearUsuario, actualizarUsuario, borrarUsuario };