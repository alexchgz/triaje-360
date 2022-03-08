const Asignatura = require('../models/asignaturas');
const Curso = require('../models/cursos');
const Usuario = require('../models/usuarios');
const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const { deleteEjercicio } = require('../helpers/hEjercicio');
const { updateAsignatura } = require('../helpers/hAsignatura');

const getAsignaturas = async(req, res = response) => {

    // PARAMETROS
    const id = req.query.id;
    const currentPage = Number(req.query.currentPage);
    var pageSize = Number(req.query.pageSize) || 0;
    const desde = (currentPage - 1) * pageSize || 0;
    const schoolYear = req.query.schoolYear;
    const userId = req.query.userId;
    // preparamos texto para buscar
    let texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }

    // Solo puede crear asignaturas un admin
    const token = req.header('x-token');

    if (!(infoToken(token).rol === 'ROL_ADMIN') && !(infoToken(token).rol === 'ROL_PROFESOR') && !(infoToken(token).rol === 'ROL_ALUMNO')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para obtener asignatura',
        });
    }

    try {

        // si tenemos usuario comprobamos que existe
        if(userId) {
            const existeUsuario = Usuario.findById(userId);
            if (!existeUsuario) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario no existe'
                });
            }
        }
        // si no nos lo pasan -> selector de asignaturas para crear ejercicio

        var asignaturas, totalAsignaturas, 
            idsProfesoresAsignados=[], profesoresAsignados=[], profesoresNoAsignados=[], 
            idsAlumnosAsignados=[], alumnosAsignados=[], alumnosNoAsignados=[];
        
        if (id) { // si nos pasan un id
            [asignaturas, totalAsignaturas] = await Promise.all([
                // buscamos por el id
                Asignatura.findById(id).populate('curso', '-__v').populate('profesores.usuario', '-password, -alta, -__v').populate('alumnos.usuario', '-password, -alta, -__v'),
                // consulta para obtener el numero total de usuarios
                Asignatura.countDocuments()
            ]);

            // ademas de obtener la asignatura tenemos que obtener los profesores/alumnos que no estan en la asignatura
            // para poder gestionar los usuarios de una asignatura
                // almacenamos los profesores asignados
            if(asignaturas.profesores.length > 0) {
                for(let i = 0; i < asignaturas.profesores.length; i++) {
                  profesoresAsignados.push(asignaturas.profesores[i].usuario);
                  idsProfesoresAsignados.push(asignaturas.profesores[i].usuario._id);
                }
            }
                // almacenamos los alumnos asignados
            if(asignaturas.alumnos.length > 0) {
                for(let j = 0; j < asignaturas.alumnos.length; j++) {
                  alumnosAsignados.push(asignaturas.alumnos[j].usuario);
                  idsAlumnosAsignados.push(asignaturas.alumnos[j].usuario._id);
                }
            }

            [profesoresNoAsignados, alumnosNoAsignados] = await Promise.all([
                // consulta para profesores NO asignados a la asignatura
                Usuario.find({ activo: true, rol: "ROL_PROFESOR", _id: { $nin: idsProfesoresAsignados } }, 'nombre apellidos email rol curso activo')
                .sort({ apellidos: 1, nombre: 1 })
                .populate('curso', '-__v'),
                // consulta para profesores NO asignados a la asignatura
                Usuario.find({ activo: true, rol: "ROL_ALUMNO", _id: { $nin: idsAlumnosAsignados } }, 'nombre apellidos email rol curso activo')
                .sort({ apellidos: 1, nombre: 1 })
                .populate('curso', '-__v')
            ]);

        } else { // si no nos pasan el id

            // si no tenemos pageSize lo ponemos muy alto
            if(pageSize == 0) { pageSize = 1000000; }

            // si no tenemos curso filtramos sin curso
            if (!schoolYear) {

                // ADMIN
                if (infoToken(token).rol === 'ROL_ADMIN') {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [asignaturas, totalAsignaturas] = await Promise.all([
                        // consulta con los parametros establecidos
                        Asignatura.find({}).skip(desde).limit(pageSize).populate('curso', '-__v')
                        .populate({
                            path: 'profesores.usuario',
                            select: 'rol nombre'
                        })
                        .populate({
                            path: 'alumnos.usuario',
                            select: 'rol nombre'
                        }),
                        // consulta para obtener el numero total de usuarios
                        Asignatura.countDocuments({})
                    ]);
                }

                // PROFESORES
                if (infoToken(token).rol === 'ROL_PROFESOR') {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [asignaturas, totalAsignaturas] = await Promise.all([
                        // consulta con los parametros establecidos
                        Asignatura.find({ 'profesores.usuario': userId }).skip(desde).limit(pageSize).populate('curso', '-__v')
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
                }

                // ALUMNOS
                if (infoToken(token).rol === 'ROL_ALUMNO') {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [asignaturas, totalAsignaturas] = await Promise.all([
                        // consulta con los parametros establecidos
                        Asignatura.find({ 'alumnos.usuario': userId }).skip(desde).limit(pageSize).populate('curso', '-__v')
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
                } 

            } else {
                    
                // ADMIN
                if (infoToken(token).rol === 'ROL_ADMIN') {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [asignaturas, totalAsignaturas] = await Promise.all([
                        // consulta con los parametros establecidos
                        Asignatura.find({ curso: schoolYear }).skip(desde).limit(pageSize).populate('curso', '-__v')
                        .populate({
                            path: 'profesores.usuario',
                            select: 'rol nombre'
                        })
                        .populate({
                            path: 'alumnos.usuario',
                            select: 'rol nombre'
                        }),
                        // consulta para obtener el numero total de usuarios
                        Asignatura.countDocuments({ curso: schoolYear })
                    ]);
                }

                // PROFESORES
                if (infoToken(token).rol === 'ROL_PROFESOR') {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [asignaturas, totalAsignaturas] = await Promise.all([
                        // consulta con los parametros establecidos
                        Asignatura.find({ 'profesores.usuario': userId, curso: schoolYear }).skip(desde).limit(pageSize).populate('curso', '-__v')
                        .populate({
                            path: 'profesores.usuario',
                            select: 'rol nombre'
                        })
                        .populate({
                            path: 'alumnos.usuario',
                            select: 'rol nombre'
                        }),
                        // consulta para obtener el numero total de usuarios
                        Asignatura.countDocuments({ 'profesores.usuario': userId, curso: schoolYear })
                    ]);
                }

                // ALUMNOS
                if (infoToken(token).rol === 'ROL_ALUMNO') {
                    // usamos Promise.all para realizar las consultas de forma paralela
                    [asignaturas, totalAsignaturas] = await Promise.all([
                        // consulta con los parametros establecidos
                        Asignatura.find({ 'alumnos.usuario': userId, curso: schoolYear }).skip(desde).limit(pageSize).populate('curso', '-__v')
                        .populate({
                            path: 'profesores.usuario',
                            select: 'rol nombre'
                        })
                        .populate({
                            path: 'alumnos.usuario',
                            select: 'rol nombre'
                        }),
                        // consulta para obtener el numero total de usuarios
                        Asignatura.countDocuments({ 'alumnos.usuario': userId, curso: schoolYear })
                    ]);
                }
            }

        }

        res.json({
            ok: true,
            msg: 'Asignaturas obtenidas',
            asignaturas,
            totalAsignaturas,
            profesoresAsignados,
            profesoresNoAsignados,
            alumnosAsignados,
            alumnosNoAsignados,
            pageSize,
            currentPage,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'error obteniendo asignaturas'
        })
    }
}

const crearAsignatura = async(req, res = response) => {

    const { curso, profesores } = req.body;

    // Solo puede crear asignaturas un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear asignatura',
        });
    }

    try {

        // comprobamos que el curso existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso no existe'
            });
        }

        // comprobamos los profesores
        let profesInsertar = []; // para limpiar los campos

        if (profesores) {
            let profesBusqueda = []; // para buscar los profesores

            const listaProfes = profesores.map(registro => {
                if (registro.usuario) {
                    profesBusqueda.push(registro.usuario);
                    profesInsertar.push(registro);
                }
            });

            // comprobamos que existan y que están bien pasados
            const existenProfes = await Usuario.find().where('_id').in(profesBusqueda);
            if (existenProfes.length != profesBusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores no existe o está duplicado'
                });
            }

            // si se han pasado todos los filtros almacenamos la asignatura
            const asignatura = new Asignatura(req.body);
            // sustituimos campo por lista
            asignatura.profesores = profesInsertar;
            // guardamos en BD
            await asignatura.save();

            res.json({
                ok: true,
                msg: 'Asignatura creada',
                asignatura
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error creando asignatura'
        });
    }
}

const actualizarAsignatura = async(req, res = response) => {

    const { curso, profesores } = req.body;
    const uid = req.params.id;
    // parametros para la gestion de asignatura
    const rol = req.query.rol;
    const idUsu = req.query.idUsu;
    const accion = req.query.accion;

    // Solo puede actualizar asignaturas un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar asignatura',
        });
    }

    try {

        // comprobamos que la asignatura existe
        const existeAsignatura = await Asignatura.findById(uid);
        if (!existeAsignatura) {
            res.status(400).json({
                ok: false,
                msg: 'La asignatura no existe'
            });
        }

        // comprobamos que el curso existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso no existe'
            });
        }

        // comprobamos si se trata de gestionar una asignatura
        if(rol && idUsu && accion) {
            const asignatura = await updateAsignatura(uid, '', '', rol, idUsu, accion).then(actualizarAsignatura => {
                console.log('Asignatura actualizada:', actualizarAsignatura);
            });
            res.json({
                ok: true,
                msg: 'Asignatura actualizada',
                asignatura
            });
        // si es una actualizacion normal
        } else {
            // comprobamos los profesores
            let profesInsertar = []; // para limpiar los campos

            if (profesores) {
                let profesBusqueda = []; // para buscar los profesores

                const listaProfes = profesores.map(registro => {
                    if (registro.usuario) {
                        profesBusqueda.push(registro.usuario);
                        profesInsertar.push(registro);
                    }
                });

                // comprobamos que existan y que están bien pasados
                const existenProfes = await Usuario.find().where('_id').in(profesBusqueda);
                if (existenProfes.length != profesBusqueda.length) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Alguno de los profesores no existe o está duplicado'
                    });
                }

                // si se han pasado todos los filtros actualizamos la asignatura
                const object = req.body;
                object.profesores = profesInsertar;
                const asignatura = await Asignatura.findByIdAndUpdate(uid, object, { new: true });


                res.json({
                    ok: true,
                    msg: 'Asignatura actualizada',
                    asignatura
                });
            }
        }

        

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando asignatura'
        });
    }
}

const borrarAsignatura = async(req, res = response) => {
    const uid = req.params.id;

    // Solo puede borrar asignaturas un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para borrar asignatura',
        });
    }

    try {

        // comprobamos que la asignatura existe
        const existeAsignatura = await Asignatura.findById(uid);
        if (!existeAsignatura) {
            res.status(400).json({
                ok: false,
                msg: 'La asignatura no existe'
            });
        }

        // eliminamos los ejercicios de la asignatura
        if(existeAsignatura.ejercicios.length > 0) {
            for(let i=0; i<existeAsignatura.ejercicios.length; i++) {
                deleteEjercicio(existeAsignatura.ejercicios[i].ejercicio).then(borrarEjercicio => {
                    console.log('Ejercicio eliminado:', borrarEjercicio);
                });
            }
        }
        
        // eliminamos la asignatura
        const resultado = await Asignatura.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Asignatura eliminada',
            resultado: resultado
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error borrando asignatura'
        });
    }
}


// exportamos los metodos
module.exports = { getAsignaturas, crearAsignatura, actualizarAsignatura, borrarAsignatura };