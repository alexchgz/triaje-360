
const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const Accion = require('../models/acciones');

// funciones
const getAcciones = async(req, res = response) => {
    
    // parametros
    const id = req.query.id;

    // Comprobamos roles
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener acciones',
        });
    }

    try {
        var acciones, totalAcciones;

        if (id) { // si nos pasan un id
            [acciones, totalAcciones] = await Promise.all([
                Accion.findById(id),
                Accion.countDocuments()
            ]);

        } else { // si no nos pasan el id
            [acciones, totalAcciones] = await Promise.all([
                Accion.find({}, 'nombre tiempo'),
                Accion.countDocuments()
            ]);
            

        }

        res.json({
            ok: true,
            msg: 'Acciones obtenidas',
            acciones,
            totalAcciones,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo cursos'
        })
    }
}

const crearAccion = async(req, res = response) => {

    const { nombre, tiempo } = req.body;
    const idDesactivar = req.query.idDesactivar;

    // Solo puede crear cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear acciones',
        });
    }

    try {
        // comprobamos si ya existe el nombre
        const existeAccion = await Accion.findOne({ nombre });
        if (existeAccion) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre ya existe para otra accion'
            });
        }

        // creamos el curso  y lo almacenamos los datos en la BBDD
        const accion = new Accion(req.body);
        await accion.save();

        res.json({
            ok: true,
            msg: 'Accion creada',
            accion
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear accion'
        });
    }
}

const actualizarAccion = async(req, res = response) => {

    const { nombre, tiempo } = req.body;
    const uid = req.params.id;

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
        const existeAccion = await Accion.findById(uid);
        if (!existeAccion) {
            return res.status(400).json({
                ok: false,
                msg: 'La accion no existe'
            });
        }

        // comprobamos si ya existe el nombre
        const existeNombre = await Curso.findOne({ nombre });
        if (existeNombre && (existeNombre._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre ya existe para otra accion'
            });
        }

        // si se han superado todas la comprobaciones, actualizamos el curso
        const accion = await Accion.findByIdAndUpdate(uid, req.body, { new: true });
        res.json({
            ok: true,
            msg: 'Accion actualizada',
            accion
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando la accion'
        });
    }
}

const borrarAccion = async(req, res = response) => {

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
        const existeAccion = await Accion.findById(uid);
        if (!existeAccion) {
            return res.status(400).json({
                ok: false,
                msg: 'La accion no existe'
            });
        }


        // si se ha superado la comprobacion, eliminamos el curso
        const accion = await Accion.findByIdAndRemove(uid);
        
        res.json({
            ok: true,
            msg: 'Accion borrada',
            accion
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error borrando la accion'
        });
    }
}

// exportamos las funciones 
module.exports = { getAcciones, crearAccion, actualizarAccion, borrarAccion };