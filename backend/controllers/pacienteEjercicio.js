const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const PacienteEjercicio = require('../models/pacienteEjercicio');
const Paciente = require('../models/pacientes');
const Ejercicio = require('../models/ejercicios');

const getPacientesEjercicio = async(req, res) => {

    // parametros
    const idEjercicio = req.query.idEjercicio;

    // Solo puede obtener usuarios un admin
    const token = req.header('x-token');
    // pueden obtener usuarios admin y profesores
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener Pacientes de Ejercicio',
        });
    }

    try {
        var pacientesEjercicio, pacientesEjercicio; // variables para la búsqueda en gestion de pacientesEjercicio

        const existeEjercicio = await Ejercicio.findById(idEjercicio);
        if (!existeEjercicio) {
            return res.status(400).json({
                ok: false,
                msg: 'El ejercicio no existe'
            });
        }

        [pacientesEjercicio, totalpacientesEjercicio] = await Promise.all([
            PacienteEjercicio.find({ idEjercicio })
            .populate('idPaciente', '-__v')
            .populate('idImagen', '-__v'),
            PacienteEjercicio.countDocuments({ idEjercicio })
        ]);
        
        res.json({
            ok: true,
            msg: 'PacientesEjercicio obtenidos',
            pacientesEjercicio,
            totalpacientesEjercicio
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo pacientesEjercicio'
        })
    }
}

const crearPacienteEjercicio = async(req, res = response) => {

    // parametros
    const { idPaciente, idEjercicio, ...object } = req.body;
    
    // Solo puede crear usuarios un admin
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear pacienteEjercicio',
        });
    }

    try {
        // comprobamos que existen Paciente y Ejercicio
        const existePaciente = await Paciente.findById(idPaciente);
        if (!existePaciente) {
            return res.status(400).json({
                ok: false,
                msg: 'El paciente no existe'
            });
        }

        const existeEjercicio = await Ejercicio.findById(idEjercicio);
        if (!existeEjercicio) {
            return res.status(400).json({
                ok: false,
                msg: 'El ejercicio no existe'
            });
        }

        // comprobamos si ya existe el registro
        const existePacienteEjercicio = await PacienteEjercicio.findOne({ idPaciente, idEjercicio });
        if (existePacienteEjercicio) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un registro de este paciente para este ejercicio'
            });
        }


        // si existe la almacenamos
        object.idPaciente = idPaciente;
        object.idEjercicio = idEjercicio;
        const pacienteEjercicio = new PacienteEjercicio(object);
        await pacienteEjercicio.save();

        const populatePacienteEjercicio = await PacienteEjercicio.findById(pacienteEjercicio._id)
        .populate('idPaciente', '-__v')
        .populate('idImagen', '-__v');

        res.json({
            ok: true,
            msg: 'Paciente Ejercicio creado',
            pacienteEjercicio,
            populatePacienteEjercicio
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear Paciente Ejercicio'
        });
    }
}

const actualizarPacienteEjercicio = async(req, res) => {

    const { idPaciente, idEjercicio, ...object } = req.body;
    const uid = req.params.id;

    // Solo puede actualizar usuarios un admin
    const token = req.header('x-token');
    
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar pacientes de ejercicios',
        });
    }

    try {

        // comprobamos que existen Paciente y Ejercicio
        const existePacienteEjercicio = await PacienteEjercicio.findById(uid);
        if (!existePacienteEjercicio) {
            return res.status(400).json({
                ok: false,
                msg: 'El registro de pacienteEjercicio no existe'
            });
        }

        // comprobamos que existen Paciente y Ejercicio
        const existePaciente = await Paciente.findById(idPaciente);
        if (!existePaciente) {
            return res.status(400).json({
                ok: false,
                msg: 'El paciente no existe'
            });
        }

        const existeEjercicio = await Ejercicio.findById(idEjercicio);
        if (!existeEjercicio) {
            return res.status(400).json({
                ok: false,
                msg: 'El ejercicio no existe'
            });
        }

        object.idPaciente = idPaciente;
        object.idEjercicio = idEjercicio;
        // actualizamos los datos
        const pacienteEjercicio = await PacienteEjercicio.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'PacienteEjercicio Actualizado',
            pacienteEjercicio
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando el PacienteEjercicio'
        });
    }
}

const borrarPacienteEjercicio = async(req, res) => {

    // obtenemos el id
    const uid = req.params.id;

    // Solo puede borrar usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar pacienteEjercicios',
        });
    }

    try {
        // en primer lugar comprobamos que exista el usuario
        const existePacienteEjercicio = await PacienteEjercicio.findById(uid);

        if (!existePacienteEjercicio) {
            res.status(400).json({
                ok: false,
                msg: 'El registro PacienteEjercicio no existe'
            });
        }

        // si existe lo eliminamos
        const pacienteEjercicio = await PacienteEjercicio.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'PacienteEjercicio Eliminado',
            pacienteEjercicio
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error eliminando el PacienteEjercicio'
        });
    }

}

// Exportamos el modulo
module.exports = { getPacientesEjercicio, crearPacienteEjercicio, actualizarPacienteEjercicio, borrarPacienteEjercicio };