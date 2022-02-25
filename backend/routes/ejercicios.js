// RUTA BASE: /api/ejercicios

const { Router } = require('express');
const { getEjercicios, getAlumnosEjercicio, crearEjercicio, actualizarEjercicio, borrarEjercicio } = require('../controllers/ejercicios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // comprobamos campos opcionales
    check('id', 'El id debe ser válido').optional().isMongoId(),
    check('pageSize', 'Desde debe ser un número').optional().isNumeric(),
    check('currentPage', 'Desde debe ser un número').optional().isNumeric(),
    check('asignatura', 'Desde debe ser una cadena de texto').optional().isString(),
    check('userId', 'Desde debe ser una cadena de texto').optional().isString(),
    validarCampos
], getEjercicios);

router.get('/alumnos', [
    validarJWT,
    // comprobamos campos opcionales
    check('idEjercicio', 'El id debe ser válido').isMongoId(),
    check('pageSize', 'Desde debe ser un número').optional().isNumeric(),
    check('currentPage', 'Desde debe ser un número').optional().isNumeric(),
    check('asignatura', 'Desde debe ser una cadena de texto').optional().isString(),
    check('userId', 'Desde debe ser una cadena de texto').optional().isString(),
    check('texto', 'Desde debe ser un objeto').optional().isString(),
    validarCampos
], getAlumnosEjercicio);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('descripcion', 'El argumento descripcion es obligatorio').not().isEmpty().trim(),
    check('asignatura', 'El argumento asignatura no es válido').isMongoId(),
    validarCampos
], crearEjercicio);

router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('descripcion', 'El argumento descripcion es obligatorio').not().isEmpty().trim(),
    check('asignatura', 'El argumento asignatura no es válido').isMongoId(),
    validarCampos
], actualizarEjercicio);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarEjercicio);


// Exportamos el modulo
module.exports = router;