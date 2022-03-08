// RUTA BASE: /api/asignaturas

const { Router } = require('express');
const { getAsignaturas, crearAsignatura, actualizarAsignatura, borrarAsignatura } = require('../controllers/asignaturas');
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
    check('schoolYear', 'Desde debe ser una cadena de texto').optional().isString(),
    check('userId', 'Desde debe ser un número').optional().isString(),
    check('texto', 'Desde debe ser un objeto').optional().isString(),
    validarCampos
], getAsignaturas);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('curso', 'El argumento curso es obligatorio').isMongoId(),
    // profesores
    check('profesores.*.usuario', 'El id del profesor no es válido').optional().isMongoId(),
    validarCampos
], crearAsignatura);

router.put('/:id', [
    validarJWT,
    // profesores
    check('profesores.*usuario', 'El id del profesor no es válido').optional().isMongoId(),
    // gestionar asignatura
    check('rol', 'Desde debe ser un string').optional().isString(),
    check('idUsu', 'Desde debe ser un identificador válido').optional().isMongoId(),
    check('accion', 'Desde debe ser un string').optional().isString(),
    validarCampos
], actualizarAsignatura);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarAsignatura);


// Exportamos el modulo
module.exports = router;