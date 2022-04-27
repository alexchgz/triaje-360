
const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const ImagenPaciente = require('../models/imagenesPaciente');

// funciones
const getImagenesPaciente = async(req, res = response) => {
    
    // parametros
    const id = req.query.id;

    // Comprobamos roles
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener imagenes de pacientes',
        });
    }

    try {
        var imagenesPaciente, totalImagenesPaciente;

        if (id) { // si nos pasan un id
            [imagenesPaciente, totalImagenesPaciente] = await Promise.all([
                ImagenPaciente.findById(id),
                ImagenPaciente.countDocuments()
            ]);

        } else { // si no nos pasan el id
            [imagenesPaciente, totalImagenesPaciente] = await Promise.all([
                ImagenPaciente.find({}, 'nombre ruta'),
                ImagenPaciente.countDocuments()
            ]);
            

        }

        res.json({
            ok: true,
            msg: 'Imagenes de paciente obtenidas',
            imagenesPaciente,
            totalImagenesPaciente,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo imagenes de paciente'
        })
    }
}

const crearImagenPaciente = async(req, res = response) => {

    const { nombre } = req.body;

    // Solo puede crear cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear imagenes de Paciente',
        });
    }

    try {
        // comprobamos si ya existe el nombre
        const existeImagenPaciente = await ImagenPaciente.findOne({ nombre });
        if (existeImagenPaciente) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre ya existe para otra imagen de paciente'
            });
        }

        // creamos el curso  y lo almacenamos los datos en la BBDD
        const imagenPaciente = new ImagenPaciente(req.body);
        await imagenPaciente.save();

        res.json({
            ok: true,
            msg: 'Imagen de Paciente creada',
            imagenPaciente
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear imagen de Paciente'
        });
    }
}

const actualizarImagenPaciente = async(req, res = response) => {

    const { nombre } = req.body;
    const uid = req.params.id;

    // Solo puede actualizar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar imagenes de Paciente',
        });
    }

    try {

        // comprobamos si el curso que se esta intentando actualizar existe
        const existeImagenPaciente = await ImagenPaciente.findById(uid);
        if (!existeImagenPaciente) {
            return res.status(400).json({
                ok: false,
                msg: 'La imagen de Paciente no existe'
            });
        }

        // comprobamos si ya existe el nombre
        const existeNombre = await ImagenPaciente.findOne({ nombre });
        if (existeNombre && (existeNombre._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre ya existe para otra imagen de Paciente'
            });
        }

        // si se han superado todas la comprobaciones, actualizamos el curso
        const imagenPaciente = await ImagenPaciente.findByIdAndUpdate(uid, req.body, { new: true });
        res.json({
            ok: true,
            msg: 'Imagen de Paciente actualizada',
            imagenPaciente
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando la imagen de Paciente'
        });
    }
}

const borrarImagenPaciente = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede borrar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar imagenes de Paciente',
        });
    }

    try {

        // comprobamos si el curso que se esta intentando eliminar existe
        const existeImagenPaciente = await ImagenPaciente.findById(uid);
        if (!existeImagenPaciente) {
            return res.status(400).json({
                ok: false,
                msg: 'La imagen de Paciente no existe'
            });
        }


        // si se ha superado la comprobacion, eliminamos el curso
        const imagenPaciente = await ImagenPaciente.findByIdAndRemove(uid);
        
        res.json({
            ok: true,
            msg: 'Imagen de Paciente borrada',
            imagenPaciente
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error borrando la imagen de Paciente'
        });
    }
}

// exportamos las funciones 
module.exports = { getImagenesPaciente, crearImagenPaciente, actualizarImagenPaciente, borrarImagenPaciente };