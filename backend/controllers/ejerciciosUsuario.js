const Ejercicio = require('../models/ejercicios');
const Usuario = require('../models/usuarios');
const EjerciciosUsuario = require('../models/ejerciciosUsuario');
const { response } = require('express');
const validator = require('validator');

const { infoToken } = require('../helpers/infotoken');


const getEjerciciosUsuario = async(req, res = response) => {
    const idUsuario = req.query.idUsuario;
    const idEjercicio = req.query.idEjercicio;
    // console.log(req.query.userId);

    // Solo puede crear asignaturas un admin
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener registros de ejercicios',
        });
    }

    try {
        var ejerciciosUsuario, totalEjerciciosUsuario;

        if (idUsuario && idEjercicio) { // si nos pasan un id
            // usamos Promise.all para realizar las consultas de forma paralela
            [ejerciciosUsuario, totalEjerciciosUsuario] = await Promise.all([
                // consulta con los parametros establecidos
                EjerciciosUsuario.find({ idUsuario, idEjercicio }),
                // consulta para obtener el numero total de usuarios
                EjerciciosUsuario.countDocuments()
            ]);

        }

        res.json({
            ok: true,
            msg: 'Registros de ejercicios obtenidos',
            ejerciciosUsuario,
            totalEjerciciosUsuario
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo registros de ejercicios'
        })
    }
}


const crearEjercicioUsuario = async(req, res = response) => {

    console.log(req.body);
    const { idUsuario, idEjercicio, ...object } = req.body;
    // const idUsuario = req.query.idUsuario;
    // const idEjercicio = req.query.idEjercicio;

    // Solo puede crear ejercicios un admin o un profesor
    const token = req.header('x-token');
    // lo puede actualizar un administrador o un profesor
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear registros de ejercicios',
        });
    }

    try {
        // console.log('aaaa');
        // comprobamos que el usuario existe
        // const existeUsuario = await Usuario.findById(idUsuario);
        // if (!existeUsuario) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'El usuario no existe'
        //     });
        // }

        // console.log('eeeee');

        // comprobamos que el ejercicio existe
        // const existeEjercicio = await Ejercicio.findById(idEjercicio);
        // if (!existeEjercicio) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'El ejercicio no existe'
        //     });
        // }

        // console.log('eehhhe');

        // si existe la almacenamos
        // object.asignatura = asignatura;
        object.idUsuario = idUsuario;
        object.idEjercicio = idEjercicio;
        const ejercicioUsuario = new EjerciciosUsuario(object);
        await ejercicioUsuario.save();

        res.json({
            ok: true,
            msg: 'Registro de Ejercicio creado',
            ejercicioUsuario
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error creando registro'
        });
    }
}


// exportamos las funciones
module.exports = { getEjerciciosUsuario, crearEjercicioUsuario };