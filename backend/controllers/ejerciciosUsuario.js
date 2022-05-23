const Ejercicio = require('../models/ejercicios');
const Usuario = require('../models/usuarios');
const EjerciciosUsuario = require('../models/ejerciciosUsuario');
const Actividad = require('../models/actividades');
const { response } = require('express');

const { infoToken } = require('../helpers/infotoken');


const getEjerciciosUsuario = async(req, res = response) => {
    const idUsuario = req.query.idUsuario;
    const idEjercicio = req.query.idEjercicio;
    const id = req.query.id;

    // comprobamos roles
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener registros de ejercicios',
        });
    }

    try {
        var ejerciciosUsuario, totalEjerciciosUsuario, ejercicio, actividades;

        if (idUsuario && idEjercicio) { // si tenemos id de usuario y ejercicio
            [ejerciciosUsuario, totalEjerciciosUsuario] = await Promise.all([
                EjerciciosUsuario.find({ idUsuario, idEjercicio }),
                EjerciciosUsuario.countDocuments()
            ]);
        } else {
            if(id) {
                [ejerciciosUsuario, ejercicio, actividades] = await Promise.all([
                    EjerciciosUsuario.findById(id)
                    .populate('idEjercicio', '-__v')
                    .populate('idUsuario', '-__v'),
                    Ejercicio.findById(idEjercicio)
                    .populate('pacientes.paciente', '-__v'),
                    Actividad.find( { ejercicioUsuario: id }).populate('-__v')
                    .populate('paciente', '-__v')
                    .populate('ejercicioUsuario', '-__v')
                    .populate('accion', '-__v')
                ]);
            }
        }

        res.json({
            ok: true,
            msg: 'Registros de ejercicios obtenidos',
            ejerciciosUsuario,
            totalEjerciciosUsuario,
            ejercicio,
            actividades
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

    const { idUsuario, idEjercicio, ...object } = req.body;

    // Solo puede realizar ejercicios un alumno
    const token = req.header('x-token');
    // lo puede actualizar un administrador o un profesor
    if (!(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'Solo los alumnos pueden crear registros de ejercicios',
        });
    }

    try {
        // comprobamos que el usuario existe
        const existeUsuario = await Usuario.findById(idUsuario);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        // comprobamos que el ejercicio existe
        const existeEjercicio = await Ejercicio.findById(idEjercicio);
        if (!existeEjercicio) {
            return res.status(400).json({
                ok: false,
                msg: 'El ejercicio no existe'
            });
        }

        // comprobamos que la fecha de realizacion está dentro de la disponible para el ejercicio
        let now = new Date();
        if(now > existeEjercicio.hasta) {
            return res.status(400).json({
                ok: false,
                msg: 'La fecha límite para realizar el Ejercicio ha sido superada'
            });
        }

        // si existe la almacenamos
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