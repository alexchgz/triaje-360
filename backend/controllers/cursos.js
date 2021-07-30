// librerias
const { response } = require('express');
const { validator } = require('validator');

// modelo
const Curso = require('../models/cursos');

// funciones
const getCursos = async(req, res = response) => {
    // parametros para la paginacion ->
    // si no es un numero lo pone a 0
    const desde = Number(req.query.desde) || 0;
    // cantidad de registros que vamos a mostrar por pagina
    const registropp = Number(process.env.DOCSPERPAGE);
    // recogemos un parametro para poder buscar tambien por id
    const id = req.query.id;

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

            [cursos, totalCursos] = await Promise.all([
                Curso.find({}, 'nombre nombrecorto activo').skip(desde).limit(registropp),
                Curso.countDocuments()
            ]);
        }

        res.json({
            ok: true,
            msg: 'Cursos obtenidos',
            cursos,
            // recogemos los datos de la página para mostrarlos en la respuesta
            page: {
                desde,
                registropp,
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

    try {

        // comprobamos si el curso que se esta intentando eliminar existe
        const existeCurso = await Curso.findById(uid);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso no existe'
            });
        }

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