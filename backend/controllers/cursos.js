// librerias
const { response } = require('express');
const { validator } = require('validator');

// modelo
const Curso = require('../models/cursos');

const { infoToken } = require('../helpers/infotoken');
const { helperAsignatura } = require('../helpers/helperAsignatura');
// const { borrarAsignatura } = require('./asignaturas');

// funciones
const getCursos = async(req, res = response) => {
    
    const id = req.query.id;
    const currentPage = Number(req.query.currentPage);
    const pageSize = Number(req.query.pageSize) || 0;
    const desde = (currentPage - 1) * pageSize;

    let texto = req.query.texto;
    // console.log(texto);
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }

    try {
        var cursos, totalCursos;

        if (id) { // si nos pasan un id
            // usamos Promise.all para realizar las consultas de forma paralela
            [cursos, totalCursos] = await Promise.all([
                // buscamos por el id
                Curso.findById(id),
                // consulta para obtener el numero total de cursos
                Curso.countDocuments()
            ]);

        } else { // si no nos pasan el id

            if(texto != undefined) {
                // usamos Promise.all para realizar las consultas de forma paralela
                [cursos, totalCursos] = await Promise.all([
                    // consulta con los parametros establecidos
                    Curso.find({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre nombrecorto activo').skip(desde).limit(pageSize),
                    // consulta para obtener el numero total de usuarios
                    Curso.countDocuments({ $or: [{ nombre: textoBusqueda }, { nombrecorto: textoBusqueda }] })
                ]);
            }
            else {
                [cursos, totalCursos] = await Promise.all([
                    // consulta con los parametros establecidos
                    Curso.find({}, 'nombre nombrecorto activo').skip(desde).limit(pageSize),
                    // consulta para obtener el numero total de usuarios
                    Curso.countDocuments()
                ]);
            }

        }

        res.json({
            ok: true,
            msg: 'Cursos obtenidos',
            cursos,
            totalCursos,
            pageSize,
            currentPage,
            // recogemos los datos de la página para mostrarlos en la respuesta
            page: {
                desde,
                currentPage,
                totalCursos
            }
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo cursos'
        })
    }
}

const crearCurso = async(req, res = response) => {

    const { nombre, nombrecorto } = req.body;

    // Solo puede crear cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear cursos',
        });
    }

    try {
        // comprobamos si ya existe el nombre
        const existeNombre = await Curso.findOne({ nombre });
        if (existeNombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre ya existe para otro curso'
            });
        }

        // comprobamos si ya existe el nombrecorto
        const existeNombreCorto = await Curso.findOne({ nombrecorto });
        if (existeNombreCorto) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre corto ya existe para otro curso'
            });
        }

        // creamos el curso  y lo almacenamos los datos en la BBDD
        const curso = new Curso(req.body);
        await curso.save();

        res.json({
            ok: true,
            msg: 'Curso creado',
            curso
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear curso'
        });
    }
}

const actualizarCurso = async(req, res = response) => {

    const { nombre, nombrecorto } = req.body;
    const uid = req.params.id;

    // Solo puede actualizar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar cursos',
        });
    }

    try {

        // comprobamos si el curso que se esta intentando actualizar existe
        const existeCurso = await Curso.findById(uid);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso no existe'
            });
        }

        // comprobamos si ya existe el nombre
        const existeNombre = await Curso.findOne({ nombre });
        if (existeNombre && (existeNombre._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre ya existe para otro curso'
            });
        }

        // comprobamos si ya existe el nombrecorto
        const existeNombreCorto = await Curso.findOne({ nombrecorto });
        if (existeNombreCorto && (existeNombreCorto._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre corto ya existe para otro curso'
            });
        }

        // si se han superado todas la comprobaciones, actualizamos el curso
        const curso = await Curso.findByIdAndUpdate(uid, req.body, { new: true });
        res.json({
            ok: true,
            msg: 'Curso actualizado',
            curso
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando el curso'
        });
    }
}

const borrarCurso = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede borrar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar cursos',
        });
    }

    try {

        // comprobamos si el curso que se esta intentando eliminar existe
        const existeCurso = await Curso.findById(uid);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso no existe'
            });
        }

        helperAsignatura(existeCurso._id).then(borrarAsignatura => {
            console.log('Asignatura eliminada:', borrarAsignatura);
        });

        // si se ha superado la comprobacion, eliminamos el curso
        const curso = await Curso.findByIdAndRemove(uid);
        
        res.json({
            ok: true,
            msg: 'Curso borrado',
            curso
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error borrando el curso'
        });
    }
}

// exportamos las funciones 
module.exports = { getCursos, crearCurso, actualizarCurso, borrarCurso };