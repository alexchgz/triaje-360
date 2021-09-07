const Asignatura = require('../models/asignaturas');
const Curso = require('../models/cursos');
const Usuario = require('../models/usuarios');
const { response } = require('express');
const bcrypt = require('bcryptjs');

const getAsignaturas = async(req, res = response) => {
    // parametros para la paginacion ->
    // si no es un numero lo pone a 0
    // const desde = Number(req.query.desde) || 0;
    // // cantidad de registros que vamos a mostrar por pagina
    // const registropp = Number(process.env.DOCSPERPAGE);

    // recogemos un parametro para poder buscar tambien por id
    const id = req.query.id;
    const currentPage = Number(req.query.currentPage);
    const pageSize = Number(req.query.pageSize) || 0;
    const desde = (currentPage - 1) * pageSize;
    const schoolYear = req.query.schoolYear;

    try {
        var asignaturas, totalAsignaturas;

        if (id) { // si nos pasan un id
            // usamos Promise.all para realizar las consultas de forma paralela
            [asignaturas, totalAsignaturas] = await Promise.all([
                // buscamos por el id
                Asignatura.findById(id).populate('curso', '-__v').populate('profesores.usuario', '-password, -alta, -__v').populate('alumnos.usuario', '-password, -alta, -__v'),
                // consulta para obtener el numero total de usuarios
                Asignatura.countDocuments()
            ]);

        } else { // si no nos pasan el id

            if (schoolYear == 0 || schoolYear == null) {
                // usamos Promise.all para realizar las consultas de forma paralela
                [asignaturas, totalAsignaturas] = await Promise.all([
                    // consulta con los parametros establecidos
                    Asignatura.find({}).skip(desde).limit(pageSize).populate('curso', '-__v')
                    .populate({
                        path: 'profesores.usuario',
                        select: 'rol nombre'
                    })
                    .populate({
                        path: 'alumnos.usuario',
                        select: 'rol nombre'
                    }),
                    // consulta para obtener el numero total de usuarios
                    Asignatura.countDocuments()
                ]);
            } else {
                // usamos Promise.all para realizar las consultas de forma paralela
                [asignaturas, totalAsignaturas] = await Promise.all([
                    // consulta con los parametros establecidos
                    Asignatura.find({ curso: schoolYear }).skip(desde).limit(pageSize).populate('curso', '-__v').populate('profesores.usuario', '-password, -alta, -__v').populate('alumnos.usuario', '-password, -alta, -__v'),
                    // consulta para obtener el numero total de usuarios
                    Asignatura.countDocuments({ curso: schoolYear })
                ]);
            }

        }

        res.json({
            ok: true,
            msg: 'Asignaturas obtenidas',
            asignaturas,
            totalAsignaturas,
            pageSize,
            currentPage,
            // recogemos los datos de la página para mostrarlos en la respuesta
            page: {
                desde,
                currentPage,
                totalAsignaturas
            }
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo asignaturas'
        })
    }
}

const crearAsignatura = async(req, res = response) => {

    const { curso, profesores } = req.body;

    try {

        // comprobamos que el curso existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso no existe'
            });
        }

        // comprobamos los profesores
        let profesInsertar = []; // para limpiar los campos

        if (profesores) {
            let profesBusqueda = []; // para buscar los profesores

            const listaProfes = profesores.map(registro => {
                if (registro.usuario) {
                    profesBusqueda.push(registro.usuario);
                    profesInsertar.push(registro);
                }
            });
            console.log('profesBusqueda:', profesBusqueda);
            console.log('profesInsertar:', profesInsertar);

            // comprobamos que existan y que están bien pasados
            const existenProfes = await Usuario.find().where('_id').in(profesBusqueda);
            if (existenProfes.length != profesBusqueda.length) {
                console.log('existenProfes.length', existenProfes.length, 'profesBusqueda.length:', profesBusqueda.length);
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores no existe o está duplicado'
                });
            }

            // si se han pasado todos los filtros almacenamos la asignatura
            const asignatura = new Asignatura(req.body);
            // sustituimos campo por lista
            asignatura.profesores = profesInsertar;
            // guardamos en BD
            await asignatura.save();

            res.json({
                ok: true,
                msg: 'Asignatura creada',
                asignatura
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error creando asignatura'
        });
    }
}

const actualizarAsignatura = async(req, res = response) => {

    const { curso, profesores } = req.body;
    const uid = req.params.id;

    try {

        // comprobamos que la asignatura existe
        const existeAsignatura = await Asignatura.findById(uid);
        if (!existeAsignatura) {
            res.status(400).json({
                ok: false,
                msg: 'La asignatura no existe'
            });
        }

        // comprobamos que el curso existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso no existe'
            });
        }

        // comprobamos los profesores
        let profesInsertar = []; // para limpiar los campos

        if (profesores) {
            let profesBusqueda = []; // para buscar los profesores

            const listaProfes = profesores.map(registro => {
                if (registro.usuario) {
                    profesBusqueda.push(registro.usuario);
                    profesInsertar.push(registro);
                }
            });
            // console.log('profesBusqueda:', profesBusqueda);
            // console.log('profesInsertar:', profesInsertar);

            // comprobamos que existan y que están bien pasados
            const existenProfes = await Usuario.find().where('_id').in(profesBusqueda);
            if (existenProfes.length != profesBusqueda.length) {
                console.log('existenProfes.length', existenProfes.length, 'profesBusqueda.length:', profesBusqueda.length);
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores no existe o está duplicado'
                });
            }

            // si se han pasado todos los filtros actualizamos la asignatura
            const object = req.body;
            object.profesores = profesInsertar;
            const asignatura = await Asignatura.findByIdAndUpdate(uid, object, { new: true });


            res.json({
                ok: true,
                msg: 'Asignatura actualizada',
                asignatura
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando asignatura'
        });
    }
}

const borrarAsignatura = async(req, res = response) => {
    const uid = req.params.id;

    try {

        // comprobamos que la asignatura existe
        const existeAsignatura = await Asignatura.findById(uid);
        if (!existeAsignatura) {
            res.status(400).json({
                ok: false,
                msg: 'La asignatura no existe'
            });
        }

        const resultado = await Asignatura.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Asignatura borrada',
            resultado: resultado
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error borrando asignatura'
        });
    }
}


// exportamos los metodos
module.exports = { getAsignaturas, crearAsignatura, actualizarAsignatura, borrarAsignatura };