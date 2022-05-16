const Ejercicio = require('../models/ejercicios');
const Asignatura = require('../models/asignaturas');
const Usuario = require('../models/usuarios');
const EjerciciosUsuario = require('../models/ejerciciosUsuario');

const { response } = require('express');

const { infoToken } = require('../helpers/infotoken');
const { deleteEjerciciosUsuario } = require('../helpers/hEjerciciosUsuario');
const { updateAsignatura } = require('../helpers/hAsignatura');


const getEjercicios = async(req, res = response) => {
    // parametros
    var ObjectId = require('mongodb').ObjectID;
    const id = req.query.id;
    const currentPage = Number(req.query.currentPage);
    const pageSize = Number(req.query.pageSize) || 0;
    const desde = (currentPage - 1) * pageSize;
    const asignatura = req.query.asignatura;
    const userId = req.query.userId;

    // Comprobamos roles
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener cursos',
        });
    }

    try {
        
        var ejercicios, totalEjercicios;
        var asignaturas, totalAsignaturas;

        if (id) { // si nos pasan un id
            [ejercicios, totalEjercicios] = await Promise.all([
                // buscamos por el id
                Ejercicio.findById(id).populate('curso', '-__v')
                .populate('asignatura', 'nombre nombrecorto profesores alumnos')
                .populate('pacientes.paciente', '-__v')
                .populate('imgs.img', '-__v'),
                Ejercicio.countDocuments()
            ]);

        } else { // si no nos pasan el id

            if (!asignatura) {
                // ADMIN
                if (infoToken(token).rol === 'ROL_ADMIN') {
                    
                    [ejercicios, totalEjercicios] = await Promise.all([
                        Ejercicio
                        .find({}).skip(desde).limit(pageSize).populate('curso', '-__v')
                        .populate({
                            path: 'asignatura',
                            select: 'nombre nombrecorto profesores alumnos'
                        }),
                        Ejercicio.countDocuments({})
                    ]);
                }

                // PROFESORES
                if (infoToken(token).rol === 'ROL_PROFESOR') {
                    // 1. Obetenemos asiganturas del profesor
                    [asignaturas, totalAsignaturas] = await Promise.all([
                        Asignatura.find({ 'profesores.usuario': userId }).populate('curso', '-__v')
                        .populate({
                            path: 'profesores.usuario',
                            select: 'rol nombre'
                        })
                        .populate({
                            path: 'alumnos.usuario',
                            select: 'rol nombre'
                        }),
                        Asignatura.countDocuments({ 'profesores.usuario': userId })
                    ]);

                    // 2. Obtenemos ejercicios de esas asignaturas
                    [ejercicios, totalEjercicios] = await Promise.all([
                        Ejercicio.find({ asignatura: { $in: asignaturas } }).skip(desde).limit(pageSize).populate('curso', '-__v')
                            .populate({
                                path: 'asignatura',
                                select: 'nombre nombrecorto profesores alumnos'
                            }), 
                        Ejercicio.countDocuments({ asignatura: { $in: asignaturas } })
                    ]);

                }

                // ALUMNOS
                if (infoToken(token).rol === 'ROL_ALUMNO') {
                    // 1. Obetenemos asiganturas del alumno
                    [asignaturas, totalAsignaturas] = await Promise.all([
                        Asignatura.find({ 'alumnos.usuario': userId }).populate('curso', '-__v')
                        .populate({
                            path: 'profesores.usuario',
                            select: 'rol nombre'
                        })
                        .populate({
                            path: 'alumnos.usuario',
                            select: 'rol nombre'
                        }),
                        Asignatura.countDocuments({ 'alumnos.usuario': userId })
                    ]);

                    // 2. Obtenemos ejercicios de esas asignaturas
                    [ejercicios, totalEjercicios] = await Promise.all([
                        Ejercicio.find({ asignatura: { $in: asignaturas } }).skip(desde).limit(pageSize).populate('curso', '-__v')
                        .populate({
                            path: 'asignatura',
                            select: 'nombre nombrecorto profesores alumnos'
                        }), 
                        Ejercicio.countDocuments({ asignatura: { $in: asignaturas } })
                    ]);

                    // 3. Obtenemos intentos de esos ejercicios
                    listaPeticiones = [];
                    // console.log('user:', userId);
                    ejercicios.map(ejer=> {
                        listaPeticiones.push(EjerciciosUsuario.countDocuments({ 
                            $and: [
                                { 'idEjercicio': ejer._id },
                                { 'idUsuario': userId }
                            ]
                        }));
                    });
                    
                    resultados = await Promise.all(listaPeticiones);

                    // 4. Creamos el objeto con los atributos deseados para la respuesta
                    devolver = [];
                    for(i=0; i<ejercicios.length; i++) {
                        devolver.push({...ejercicios[i]._doc, intentos: resultados[i]});
                    }

                    ejercicios = devolver;
                    
                }

            } else {
                // ADMIN
                if (infoToken(token).rol === 'ROL_ADMIN') {
                    [ejercicios, totalEjercicios] = await Promise.all([
                        Ejercicio
                        .find({ asignatura: asignatura })
                        .skip(desde).limit(pageSize)
                        .populate('curso', '-__v')
                        .populate({
                            path: 'asignatura',
                            select: 'nombre nombrecorto profesores alumnos'
                        }),
                        Ejercicio.countDocuments({ asignatura: asignatura })
                    ]);
                }

                // PROFESORES
                if (infoToken(token).rol === 'ROL_PROFESOR') {
                    [ejercicios, totalEjercicios] = await Promise.all([
                        Ejercicio.find({ asignatura: asignatura }).skip(desde).limit(pageSize).populate('curso', '-__v')
                        .populate({
                            path: 'asignatura',
                            select: 'nombre nombrecorto profesores alumnos'
                        }),
                        Ejercicio.countDocuments({ asignatura: asignatura })
                    ]);
                }

                // ALUMNOS
                if (infoToken(token).rol === 'ROL_ALUMNO') {
                    // 1. Obtenemos los ejericios de esa asignatura
                    [ejercicios, totalEjercicios] = await Promise.all([
                        Ejercicio.find({ asignatura: asignatura }).skip(desde).limit(pageSize).populate('curso', '-__v')
                        .populate({
                            path: 'asignatura',
                            select: 'nombre nombrecorto profesores alumnos'
                        }),

                        Ejercicio.countDocuments({ asignatura: asignatura })
                    ]);

                    // 2. Obtenemos intentos de esos ejercicios
                    listaPeticiones = [];
                    ejercicios.map(ejer=> {
                        listaPeticiones.push(EjerciciosUsuario.countDocuments({ 
                            $and: [
                                { 'idEjercicio': ejer._id },
                                { 'idUsuario': userId }
                            ]
                        }));
                    });

                    resultados = await Promise.all(listaPeticiones);

                    // 3. Creamos el objeto con los atributos deseados para la respuesta
                    devolver = [];
                    for(i=0; i<ejercicios.length; i++) {
                        devolver.push({...ejercicios[i]._doc, intentos: resultados[i]});
                    }

                    ejercicios = devolver;
                }

            }
        }

        // sacamos lista de los ejercicios que están a tiempo de realizarse
        let ejerciciosEnTiempo = [];
        let now = new Date();

        for(let i=0; i<ejercicios.length; i++) {
            if(now < ejercicios[i].hasta) {
                ejerciciosEnTiempo.push(ejercicios[i]._id);
            }
        }

        res.json({
            ok: true,
            msg: 'Ejercicios obtenidos',
            ejercicios,
            totalEjercicios,
            ejerciciosEnTiempo,
            pageSize,
            currentPage,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo ejercicios'
        })
    }
}

const getAlumnosEjercicio = async(req, res = response) => {
    var ObjectId = require('mongodb').ObjectID;
    const idEjercicio = req.query.idEjercicio;
    const currentPage = Number(req.query.currentPage);
    const pageSize = Number(req.query.pageSize) || 0;
    const desde = (currentPage - 1) * pageSize;
    
    // preparamos para buscar por texto 
    let texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }

    // Comprobamos roles
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos',
        });
    }

    try {

        var ejercicio, alumnosEjercicio;

        if (infoToken(token).rol === 'ROL_ADMIN' || infoToken(token).rol === 'ROL_PROFESOR') {
            // obtenemos el ejercicio con los datos de los alumnos
            ejercicio = await Ejercicio.findById(idEjercicio).populate('curso', '-__v')
            .populate({
                path: 'asignatura',
                populate: {
                    path: 'alumnos',
                    populate: {
                        path: 'usuario',
                        select: 'nombre apellidos email'
                    }
                },
            });
            // nos quedamos con los alumnos del ejercicio
            alumnosEjercicio = ejercicio.asignatura.alumnos;

            let alumnosEjercicioFiltrados = [];
            // si tenemos texto filtramos los alumnos por ese texto
            if(texto != undefined) {
                let alumnosFiltrados = [];
                alumnosFiltrados = await Usuario.find({ rol: 'ROL_ALUMNO', $or: [{ nombre: textoBusqueda }, { email: textoBusqueda }, { apellidos: textoBusqueda }] }, 'nombre apellidos email rol curso activo')
                .populate('curso', '-__v');

                for(let i=0; i<alumnosFiltrados.length; i++) {
                    for(let j=0; j<alumnosEjercicio.length; j++) {
                        if(alumnosFiltrados[i]._id.equals(alumnosEjercicio[j].usuario._id)) {
                            alumnosEjercicioFiltrados.push(alumnosFiltrados[i]);

                        }
                    }
                }
            // si no devolvemos todos los alumnos del ejercicio
            } else {
                for(let i=0; i<alumnosEjercicio.length; i++) {
                    alumnosEjercicioFiltrados.push(alumnosEjercicio[i].usuario);
                }
            }

            alumnosEjercicio = alumnosEjercicioFiltrados;

        } else {
            return res.status(400).json({
                ok: false,
                msg: 'No dispones de acceso para ver los alumnos'
            });
        }

        res.json({
            ok: true,
            msg: 'Alumnos del Ejercicio obtenidos',
            alumnosEjercicio,
            pageSize,
            currentPage,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo alumnos del ejercicio'
        })
    }
}

const crearEjercicio = async(req, res = response) => {

    const { asignatura, ...object } = req.body;

    // Solo puede crear ejercicios un admin o un profesor
    const token = req.header('x-token');
    // lo puede actualizar un administrador o un profesor
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear ejercicios',
        });
    }

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

        // actualizamos la asignatura incluyendo el ejercicio
        await updateAsignatura(existeAsignatura._id, '', ejercicio).then(actualizarAsignaturaEjercicio => {
            console.log('Asignatura con Ejercicio actualizada:', actualizarAsignaturaEjercicio);
        });

        // guardamos el ejercicio
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
            msg: 'Error creando ejercicio'
        });
    }
}

const actualizarEjercicio = async(req, res = response) => {

    const { asignatura, ...object } = req.body;
    const uid = req.params.id;

    // Solo puede actualizar ejercicios un admin o un profesor
    const token = req.header('x-token');
    // lo puede actualizar un administrador o un profesor
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar ejercicios',
        });
    }

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

        object.asignatura = asignatura;
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
            msg: 'Error actualizando ejercicio'
        });
    }
}

const borrarEjercicio = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede borrar ejercicios un admin o un profesor
    const token = req.header('x-token');
    // lo puede actualizar un administrador o un profesor
    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar ejercicios',
        });
    }

    try {

        // comprobamos que el ejercicio existe
        const existeEjercicio = await Ejercicio.findById(uid);
        if (!existeEjercicio) {
            res.status(400).json({
                ok: false,
                msg: 'El ejercicio no existe'
            });
        }

        // eliminamos registros del ejercicio antes de eliminarlo
        await deleteEjerciciosUsuario(existeEjercicio._id).then(borrarEjerciciosUsuario => {
            console.log('Ejercicios Usuario eliminados:', borrarEjerciciosUsuario);
        });

        // actualizamos la asignatura del ejercicio
        await updateAsignatura(existeEjercicio._id).then(actualizarAsignaturaEjercicio => {
            console.log('Asignatura Ejercicio actualizada:', actualizarAsignaturaEjercicio);
        });

        // despues eliminamos el ejercicio
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
module.exports = { getEjercicios, getAlumnosEjercicio, crearEjercicio, actualizarEjercicio, borrarEjercicio };