
const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const Paciente = require('../models/pacientes');
const { updateEjercicio } = require('../helpers/hEjercicio');

// funciones
const getPacientes = async(req, res = response) => {
    
    // parametros
    const id = req.query.id;

    // Comprobamos roles
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener pacientes',
        });
    }

    try {
        var pacientes, totalPacientes;

        if (id) { // si nos pasan un id
            [pacientes, totalPacientes] = await Promise.all([
                Paciente.findById(id),
                Paciente.countDocuments()
            ]);

        } else { // si no nos pasan el id
            [pacientes, totalPacientes] = await Promise.all([
                Paciente.find({}, 'descripcion camina color img acciones empeora tiempoEmpeora'),
                Paciente.countDocuments()
            ]);
            

        }

        res.json({
            ok: true,
            msg: 'Pacientes obtenidas',
            pacientes, 
            totalPacientes
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo pacientes'
        })
    }
}

const crearPaciente = async(req, res = response) => {

    const idEjercicio = req.query.exerciseId;
    // Solo puede crear cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear pacientes',
        });
    }

    try {

        // creamos el curso  y lo almacenamos los datos en la BBDD
        const paciente = new Paciente(req.body);

        // actualizamos la asignatura incluyendo el ejercicio
        await updateEjercicio(idEjercicio, paciente).then(actualizarPacientesEjercicio => {
            console.log('Pacientes de Ejercicio actualizados:', actualizarPacientesEjercicio);
        });

        await paciente.save();



        res.json({
            ok: true,
            msg: 'Paciente creado',
            paciente
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear paciente'
        });
    }
}

const actualizarPaciente = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede actualizar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar pacientes',
        });
    }

    try {

        // comprobamos si el curso que se esta intentando actualizar existe
        const existePaciente = await Paciente.findById(uid);
        if (!existePaciente) {
            return res.status(400).json({
                ok: false,
                msg: 'El paciente no existe'
            });
        }

        // si se han superado todas la comprobaciones, actualizamos el curso
        const paciente = await Paciente.findByIdAndUpdate(uid, req.body, { new: true });
        res.json({
            ok: true,
            msg: 'Paciente actualizado',
            paciente
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando paciente'
        });
    }
}

const borrarPaciente = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede borrar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar imagenes',
        });
    }

    try {

        // comprobamos si el curso que se esta intentando eliminar existe
        const existePaciente = await Paciente.findById(uid);
        if (!existePaciente) {
            return res.status(400).json({
                ok: false,
                msg: 'El paciente no existe'
            });
        }


        // si se ha superado la comprobacion, eliminamos el curso
        const paciente = await Paciente.findByIdAndRemove(uid);
        
        res.json({
            ok: true,
            msg: 'Paciente borrado',
            paciente
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error borrando paciente'
        });
    }
}

// exportamos las funciones 
module.exports = { getPacientes, crearPaciente, actualizarPaciente, borrarPaciente };