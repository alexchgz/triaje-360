const Ejercicio = require('../models/ejercicios');
const Asignatura = require('../models/asignaturas');
const EjerciciosUsuario = require('../models/ejerciciosUsuario');

const { response } = require('express');
const validator = require('validator');

const { infoToken } = require('../helpers/infotoken');
const ejerciciosUsuario = require('../models/ejerciciosUsuario');

const getEjercicios = async(req, res = response) => {
    // parametros para la paginacion ->
    // si no es un numero lo pone a 0
    // const desde = Number(req.query.desde) || 0;
    // cantidad de registros que vamos a mostrar por pagina
    // const registropp = Number(process.env.DOCSPERPAGE);

    var ObjectId = require('mongodb').ObjectID;
    // recogemos un parametro para poder buscar tambien por id
    const id = req.query.id;
    const currentPage = Number(req.query.currentPage);
    const pageSize = Number(req.query.pageSize) || 0;
    const desde = (currentPage - 1) * pageSize;
    const asignatura = req.query.asignatura;
    const userId = req.query.userId;
    // console.log(req.query.id);

    // Solo puede crear asignaturas un admin
    const token = req.header('x-token');

    try {
        // console.log('Estoy');
        var ejercicios, totalEjercicios;
        var asignaturas, totalAsignaturas;
        // var ejerciciosUsuario, intentosPorEjercicioUsuario, registrosPorEjercicioUsuario;

        if (id) { // si nos pasan un id
            // console.log('entro');
            // usamos Promise.all para realizar las consultas de forma paralela
            [ejercicios, totalEjercicios] = await Promise.all([
                // buscamos por el id
                Ejercicio.findById(id).populate('curso', '-__v')
                .populate({
                    path: 'asignatura',
                    select: 'nombre nombrecorto profesores alumnos'
                }),
                // consulta para obtener el numero total de ejercicios
                Ejercicio.countDocuments()
            ]);

            // console.log(ejercicios);

        } else { // si no nos pasan el id


            if (asignatura == 0 || asignatura == null) {
                // console.log('aaaa');
                if (infoToken(token).rol === 'ROL_ADMIN') {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [ejercicios, totalEjercicios] = await Promise.all([
                        // consulta con los parametros establecidos
                        Ejercicio
                        .find({}).skip(desde).limit(pageSize).populate('curso', '-__v')
                        .populate({
                            path: 'asignatura',
                            select: 'nombre nombrecorto profesores alumnos'
                        }),

                        // consulta para obtener el numero total de usuarios
                        Ejercicio.countDocuments({})
                    ]);
                }

                // PROFESORES
                if (infoToken(token).rol === 'ROL_PROFESOR') {

                    // 1. Obetenemos asiganturas
                    [asignaturas, totalAsignaturas] = await Promise.all([
                        // consulta con los parametros establecidos
                        Asignatura.find({ 'profesores.usuario': userId }).populate('curso', '-__v')
                        .populate({
                            path: 'profesores.usuario',
                            select: 'rol nombre'
                        })
                        .populate({
                            path: 'alumnos.usuario',
                            select: 'rol nombre'
                        }),
                        // consulta para obtener el numero total de usuarios
                        Asignatura.countDocuments({ 'profesores.usuario': userId })
                    ]);

                    // 2. Obtenemos ejercicios de esas asignaturas
                    [ejercicios, totalEjercicios] = await Promise.all([
                        Ejercicio.find({ asignatura: { $in: asignaturas } }).skip(desde).limit(pageSize).populate('curso', '-__v')
                            .populate({
                                path: 'asignatura',
                                select: 'nombre nombrecorto profesores alumnos'
                            }), 

                            // consulta para obtener el numero total de usuarios
                        Ejercicio.countDocuments({ asignatura: { $in: asignaturas } })
                    ]);

                    // console.log(ejercicios);
                }

                // ALUMNOS
                if (infoToken(token).rol === 'ROL_ALUMNO') {

                    // 1. Obetenemos asiganturas
                    [asignaturas, totalAsignaturas] = await Promise.all([
                        // consulta con los parametros establecidos
                        Asignatura.find({ 'alumnos.usuario': userId }).populate('curso', '-__v')
                        .populate({
                            path: 'profesores.usuario',
                            select: 'rol nombre'
                        })
                        .populate({
                            path: 'alumnos.usuario',
                            select: 'rol nombre'
                        }),
                        // consulta para obtener el numero total de usuarios
                        Asignatura.countDocuments({ 'alumnos.usuario': userId })
                    ]);

                    // 2. Obtenemos ejercicios de esas asignaturas
                    [ejercicios, totalEjercicios] = await Promise.all([
                        Ejercicio.find({ asignatura: { $in: asignaturas } }).skip(desde).limit(pageSize).populate('curso', '-__v')
                        .populate({
                            path: 'asignatura',
                            select: 'nombre nombrecorto profesores alumnos'
                        }), 

                        // consulta para obtener el numero total de usuarios
                        Ejercicio.countDocuments({ asignatura: { $in: asignaturas } })
                    ]);

                    // 3. Obtenemos intentos de esos ejercicios
                    listaPeticiones = [];
                    ejercicios.map(ejer=> {
                        // variable = EjerciciosUsuario.countDocuments({ 'idEjercicio: ejer._id });
                        listaPeticiones.push(EjerciciosUsuario.countDocuments({ 'idEjercicio': ejer._id }));
                    });

                    resultados = await Promise.all(listaPeticiones);

                    // 4. Creamos el objeto con los atributos deseados para la respuesta
                    devolver = [];
                    for(i=0; i<ejercicios.length; i++) {
                        devolver.push({...ejercicios[i]._doc, intentos: resultados[i]});
                    }

                    // console.log(devolver);
                    ejercicios = devolver;
                    // console.log(totalEjercicios);
                }

            } else {
        
                // TO DO: comprobamos que el alumnos tenga la asignatura

                if (infoToken(token).rol === 'ROL_ADMIN') {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [ejercicios, totalEjercicios] = await Promise.all([
                        // consulta con los parametros establecidos
                        Ejercicio
                        .find({ asignatura: asignatura })
                        .skip(desde).limit(pageSize)
                        .populate('curso', '-__v')
                        .populate({
                            path: 'asignatura',
                            select: 'nombre nombrecorto profesores alumnos'
                        }),

                        // consulta para obtener el numero total de usuarios
                        Ejercicio.countDocuments({ asignatura: asignatura })
                    ]);

                }

                // PROFESORES
                if (infoToken(token).rol === 'ROL_PROFESOR') {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [ejercicios, totalEjercicios] = await Promise.all([
                        // consulta con los parametros establecidos
                        // Ejercicio.find({ asignatura: asignatura, 'asignatura.profesores.usuario': userId }).skip(desde).limit(pageSize).populate('curso', '-__v')
                        Ejercicio.find({ asignatura: asignatura }).skip(desde).limit(pageSize).populate('curso', '-__v')
                        .populate({
                            path: 'asignatura',
                            select: 'nombre nombrecorto profesores alumnos'
                        }),

                        // consulta para obtener el numero total de usuarios
                        // Ejercicio.countDocuments({ asignatura: asignatura, 'asignatura.profesores.usuario': userId })
                        Ejercicio.countDocuments({ asignatura: asignatura })
                    ]);
                    // console.log('voy');
                    // console.log(ejercicios);
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
                        // variable = EjerciciosUsuario.countDocuments({ 'idEjercicio: ejer._id });
                        listaPeticiones.push(EjerciciosUsuario.countDocuments({ 'idEjercicio': ejer._id }));
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

        // console.log(ejercicios);
        // console.log('vamos a devolver ejercicio');
        let ejerciciosEnTiempo = [];
        let now = new Date();
        // console.log('DATE:', now);
        for(let i=0; i<ejercicios.length; i++) {
            if(now < ejercicios[i].hasta) {
                console.log(ejercicios[i].hasta);
                // console.log('SE PUEDE HACER EL EJERCICIO');
                ejerciciosEnTiempo.push(ejercicios[i]._id);
            }
        }

        // console.log(ejerciciosEnTiempo);

        res.json({
            ok: true,
            msg: 'Ejercicios obtenidos',
            ejercicios,
            totalEjercicios,
            ejerciciosEnTiempo,
            // ejerciciosUsuario,
            // totalEjerciciosUsuario,
            pageSize,
            currentPage,
            // recogemos los datos de la página para mostrarlos en la respuesta
            page: {
                desde,
                currentPage,
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

const getAlumnosEjercicio = async(req, res = response) => {

    var ObjectId = require('mongodb').ObjectID;
    // recogemos un parametro para poder buscar tambien por id
    const idEjercicio = req.query.idEjercicio;
    const currentPage = Number(req.query.currentPage);
    const pageSize = Number(req.query.pageSize) || 0;
    const desde = (currentPage - 1) * pageSize;
    const asignatura = req.query.asignatura;
    const userId = req.query.userId;

    // Solo puede crear asignaturas un admin
    const token = req.header('x-token');

    try {
        // console.log('Estoy');
        var ejercicio, alumnosEjercicio;

        if (infoToken(token).rol === 'ROL_ADMIN' || infoToken(token).rol === 'ROL_PROFESOR') {

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
            // ejercicio = this.getEjercicios(idEjercicio);
            // console.log(ejercicio);
            alumnosEjercicio = ejercicio.asignatura.alumnos;
            // console.log(alumnosEjercicio);

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
            // recogemos los datos de la página para mostrarlos en la respuesta
            page: {
                desde,
                currentPage,
            }
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