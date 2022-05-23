
const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const Actividad = require('../models/actividades');
const { updateEjerciciosUsuario } = require('../helpers/hEjerciciosUsuario');

// funciones
const getActividades = async(req, res = response) => {
    
    // parametros
    const id = req.query.id;

    // Comprobamos roles
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener actividades',
        });
    }

    try {
        var actividades, totalActividades;

        if (id) { // si nos pasan un id
            [actividades, totalActividades] = await Promise.all([
                Actividad.find( { ejercicioUsuario: id }).populate('-__v')
                .populate('paciente', '-__v')
                .populate('ejercicioUsuario', '-__v')
                .populate('accion', '-__v'),
                Actividad.countDocuments()
            ]);

        } else { // si no nos pasan el id
            [actividades, totalActividades] = await Promise.all([
                Actividad.find({}),
                Actividad.countDocuments()
            ]);
            

        }

        res.json({
            ok: true,
            msg: 'Acividades obtenidas',
            actividades,
            totalActividades,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo actividades'
        })
    }
}

const crearActividad = async(req, res = response) => {

    const { nombre, momento, ejercicioUsuario } = req.body;

    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear actividades',
        });
    }

    try {

        // creamos el curso  y lo almacenamos los datos en la BBDD
        const actividad = new Actividad(req.body);
        // actualizamos la asignatura incluyendo el ejercicio
        if(nombre == "Terminar Ejercicio") {
            await updateEjerciciosUsuario(ejercicioUsuario, momento).then(actualizarEjerciciosUsuario => {
                console.log('Ejercicio Usuario actualizado:', actualizarEjerciciosUsuario);
            });
        }
        
        await actividad.save();

        res.json({
            ok: true,
            msg: 'Actividad creada',
            actividad
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear actividad'
        });
    }
}

const actualizarActividad = async(req, res = response) => {

    const { nombre, tiempo } = req.body;
    const uid = req.params.id;

    // Solo puede actualizar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar actividades',
        });
    }

    try {

        // comprobamos si el curso que se esta intentando actualizar existe
        const existeActividad = await Actividad.findById(uid);
        if (!existeActividad) {
            return res.status(400).json({
                ok: false,
                msg: 'La actividad no existe'
            });
        }

        // si se han superado todas la comprobaciones, actualizamos el curso
        const actividad = await Actividad.findByIdAndUpdate(uid, req.body, { new: true });
        res.json({
            ok: true,
            msg: 'Actividad actualizada',
            actividad
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando la actividad'
        });
    }
}

const borrarActividad = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede borrar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar acciones',
        });
    }

    try {

        // comprobamos si el curso que se esta intentando eliminar existe
        const existeActividad = await Actividad.findById(uid);
        if (!existeActividad) {
            return res.status(400).json({
                ok: false,
                msg: 'La actividad no existe'
            });
        }


        // si se ha superado la comprobacion, eliminamos el curso
        const actividad = await Actividad.findByIdAndRemove(uid);
        
        res.json({
            ok: true,
            msg: 'Actividad borrada',
            actividad
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error borrando la Actividad'
        });
    }
}

// exportamos las funciones 
module.exports = { getActividades, crearActividad, actualizarActividad, borrarActividad };