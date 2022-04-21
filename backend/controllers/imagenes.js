
const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const Imagen = require('../models/imagenes');

// funciones
const getImagenes = async(req, res = response) => {
    
    // parametros
    const id = req.query.id;

    // Comprobamos roles
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener imagenes',
        });
    }

    try {
        var imagenes, totalImagenes;

        if (id) { // si nos pasan un id
            [imagenes, totalImagenes] = await Promise.all([
                Imagen.findById(id),
                Imagen.countDocuments()
            ]);

        } else { // si no nos pasan el id
            [imagenes, totalImagenes] = await Promise.all([
                Imagen.find({}, 'nombre descripcion ruta'),
                Imagen.countDocuments()
            ]);
            

        }

        res.json({
            ok: true,
            msg: 'Imagenes obtenidas',
            imagenes,
            totalImagenes,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo imagenes'
        })
    }
}

const crearImagen = async(req, res = response) => {

    const { nombre } = req.body;

    // Solo puede crear cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear imagenes',
        });
    }

    try {
        // comprobamos si ya existe el nombre
        const existeImagen = await Imagen.findOne({ nombre });
        if (existeImagen) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre ya existe para otra imagen'
            });
        }

        // creamos el curso  y lo almacenamos los datos en la BBDD
        const imagen = new Imagen(req.body);
        await imagen.save();

        res.json({
            ok: true,
            msg: 'Imagen creada',
            imagen
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear imagen'
        });
    }
}

const actualizarImagen = async(req, res = response) => {

    const { nombre } = req.body;
    const uid = req.params.id;

    // Solo puede actualizar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar imagenes',
        });
    }

    try {

        // comprobamos si el curso que se esta intentando actualizar existe
        const existeImagen = await Imagen.findById(uid);
        if (!existeImagen) {
            return res.status(400).json({
                ok: false,
                msg: 'La imagen no existe'
            });
        }

        // comprobamos si ya existe el nombre
        const existeNombre = await Imagen.findOne({ nombre });
        if (existeNombre && (existeNombre._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre ya existe para otra imagen'
            });
        }

        // si se han superado todas la comprobaciones, actualizamos el curso
        const imagen = await Imagen.findByIdAndUpdate(uid, req.body, { new: true });
        res.json({
            ok: true,
            msg: 'Imagen actualizada',
            imagen
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando la imagen'
        });
    }
}

const borrarImagen = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede borrar cursos un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar imagenes',
        });
    }

    try {

        // comprobamos si el curso que se esta intentando eliminar existe
        const existeImagen = await Imagen.findById(uid);
        if (!existeImagen) {
            return res.status(400).json({
                ok: false,
                msg: 'La imagen no existe'
            });
        }


        // si se ha superado la comprobacion, eliminamos el curso
        const imagen = await Imagen.findByIdAndRemove(uid);
        
        res.json({
            ok: true,
            msg: 'Imagen borrada',
            imagen
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error borrando la imagen'
        });
    }
}

// exportamos las funciones 
module.exports = { getImagenes, crearImagen, actualizarImagen, borrarImagen };