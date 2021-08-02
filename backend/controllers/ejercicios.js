const Ejercicio = require('../models/ejercicios');
const Asignatura = require('../models/asignaturas');

const { response } = require('express');
const validator = require('validator');

const getEjercicios = async(req, res = response) => {
    // parametros para la paginacion ->
    // si no es un numero lo pone a 0
    const desde = Number(req.query.desde) || 0;
    // cantidad de registros que vamos a mostrar por pagina
    const registropp = Number(process.env.DOCSPERPAGE);

    // recogemos un parametro para poder buscar tambien por id
    const id = req.query.id;

    try {
        var ejercicios, totalEjercicios;

        if (id) { // si nos pasan un id
            // usamos Promise.all para realizar las consultas de forma paralela
            [ejercicios, totalEjercicios] = await Promise.all([
                // buscamos por el id
                Ejercicio.findById(id).populate({ path: 'asignatura', populate: { path: 'profesores.usuario', select: '-password' } }).populate({ path: 'asignatura', select: '-__v', populate: { path: 'curso', select: '-__v' } }),
                // consulta para obtener el numero total de ejercicios
                Ejercicio.countDocuments()
            ]);

        } else { // si no nos pasan el id

            // usamos Promise.all para realizar las consultas de forma paralela
            [ejercicios, totalEjercicios] = await Promise.all([
                // consulta con los parametros establecidos
                Ejercicio.find({}).skip(desde).limit(registropp).populate({ path: 'asignatura', populate: { path: 'profesores.usuario', select: '-password' } }).populate({ path: 'asignatura', select: '-__v', populate: { path: 'curso', select: '-__v' } }),
                // consulta para obtener el numero total de ejercicios
                Ejercicio.countDocuments()
            ]);
        }

        res.json({
            ok: true,
            msg: 'Ejercicios obtenidos',
            ejercicios,
            // recogemos los datos de la página para mostrarlos en la respuesta
            page: {
                desde,
                registropp,
                totalEjercicios
            }
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo ejercicios'
        })
    }
}

const crearEjercicio = async(req, res = response) => {

    const { asignatura, ...object } = req.body;

    try {

        // comprobamos que la asignatura existe
        const existeAsignatura = await Asignatura.findById(asignatura);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: 'La asignatura no existe'
            });
        }

        // si existe la almacenamos
        object.asignatura = asignatura;
        const ejercicio = new Ejercicio(object);
        await ejercicio.save();

        res.json({
            ok: true,
            msg: 'Ejercicio creado',
            ejercicio
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error creando asignatura'
        });
    }
}

const actualizarEjercicio = async(req, res = response) => {

    const { asignatura, ...object } = req.body;
    const uid = req.params.id;

    try {

        // comprobamos que el ejercicio existe
        const existeEjercicio = await Ejercicio.findById(uid);
        if (!existeEjercicio) {
            return res.status(400).json({
                ok: false,
                msg: 'El ejercicio no existe'
            });
        }

        // comprobamos que la asignatura existe
        const existeAsignatura = await Asignatura.findById(asignatura);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: 'La asignatura no existe'
            });
        }

        // si existe la actualizamos
        const ejercicio = await Ejercicio.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Ejercicio actualizado',
            ejercicio
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando asignatura'
        });
    }
}

const borrarEjercicio = async(req, res = response) => {

    const uid = req.params.id;

    try {

        // comprobamos que el ejercicio existe
        const existeEjercicio = await Ejercicio.findById(uid);
        if (!existeEjercicio) {
            res.status(400).json({
                ok: false,
                msg: 'El ejercicio no existe'
            });
        }

        const resultado = await Ejercicio.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Ejercicio borrado',
            resultado: resultado
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error borrando ejercicio'
        });
    }
}

// exportamos las funciones
module.exports = { getEjercicios, crearEjercicio, actualizarEjercicio, borrarEjercicio };