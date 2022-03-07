// librerias
const { response } = require('express');

// modelo
const Curso = require('../models/cursos');

// helpers
const { infoToken } = require('../helpers/infotoken');
const { deleteAsignatura } = require('../helpers/hAsignatura');

// funciones
const getCursos = async(req, res = response) => {
    
    // parametros
    const id = req.query.id;
    const currentPage = Number(req.query.currentPage);
    const pageSize = Number(req.query.pageSize) || 0;
    const desde = (currentPage - 1) * pageSize;
        // preparamos para buscar por texto
    let texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }

    // Comprobamos roles
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener cursos',
        });
    }

    try {
        var cursos, totalCursos;

        if (id) { // si nos pasan un id
            [cursos, totalCursos] = await Promise.all([
                Curso.findById(id),
                Curso.countDocuments()
            ]);

        } else { // si no nos pasan el id
            // segun si tenemos busqueda por texto o no
            if(texto != undefined) {
                [cursos, totalCursos] = await Promise.all([
                    Curso.find({ $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre nombrecorto activo').skip(desde).limit(pageSize),
                    Curso.countDocuments({ $or: [{ nombre: textoBusqueda }, { nombrecorto: textoBusqueda }] })
                ]);
            }
            else {
                [cursos, totalCursos] = await Promise.all([
                    Curso.find({}, 'nombre nombrecorto activo').skip(desde).limit(pageSize),
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
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo cursos'
        })
    }
}

const getCursoActivo = async(req, res = response) => {
    // FUNCION PARA COMPROBAR SI YA EXISTE ALGUN CURSO ACTIVO

    // Solo puede obtener cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener cursos',
        });
    }

    try {
        var cursoActivo;

        cursoActivo = await Curso.find({ activo: true });

        res.json({
            ok: true,
            msg: 'Curso Activo obtenidos',
            cursoActivo
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo cursos'
        });
    }
}

const crearCurso = async(req, res = response) => {

    const { nombre, nombrecorto } = req.body;
    const idDesactivar = req.query.idDesactivar;

    // Solo puede crear cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
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

        // además comprobamos si tenemos que desactivar otro curso
            // si el nuevo curso es activo hay que actualizar el anterior activo
        if(idDesactivar) {
            // comprobamos si existe el curso a desactivar
            const existeCursoDesactivar = await Curso.findById(idDesactivar);
            if (!existeCursoDesactivar) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El curso a desactivar no existe'
                });
            }

            const sendData = {
                nombre: existeCursoDesactivar.nombre,
                nombrecorto: existeCursoDesactivar.nombrecorto,
                activo: false
            }

            // actualizamos el curso con activo = false
            await Curso.findByIdAndUpdate(idDesactivar, sendData, { new: true });
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
    const idDesactivar = req.query.idDesactivar;

    // Solo puede actualizar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
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

        // además comprobamos si tenemos que desactivar otro curso
        if(idDesactivar) {
            // comprobamos si existe el curso a desactivar
            const existeCursoDesactivar = await Curso.findById(idDesactivar);
            if (!existeCursoDesactivar) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El curso a desactivar no existe'
                });
            }

            const sendData = {
                nombre: existeCursoDesactivar.nombre,
                nombrecorto: existeCursoDesactivar.nombrecorto,
                activo: false
            }

            // actualizamos el curso con activo = false
            await Curso.findByIdAndUpdate(idDesactivar, sendData, { new: true });
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
    // lo puede actualizar un administrador
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

        // eliminamos las asignaturas asociadas al curso
        await deleteAsignatura(existeCurso._id).then(borrarAsignatura => {
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
module.exports = { getCursos, getCursoActivo, crearCurso, actualizarCurso, borrarCurso };