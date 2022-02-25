// RUTA BASE: /api/cursos

const { Router } = require('express');
const { getCursos, crearCurso, actualizarCurso, borrarCurso } = require('../controllers/cursos');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// definimos las rutas
router.get('/', [
    validarJWT,
    // comprobamos campos opcionales
    check('id', 'El id debe ser válido').optional().isMongoId(),
    check('pageSize', 'Desde debe ser un número').optional().isNumeric(),
    check('currentPage', 'Desde debe ser un número').optional().isNumeric(),
    check('texto', 'Desde debe ser un objeto').optional().isString(),
    validarCampos
], getCursos);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('activo', 'El estado debe ser true o false').isBoolean(),
    validarCampos
], crearCurso);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('id', 'El identificador no es válido').isMongoId(),
    // opcionales
    check('activo', 'El estado debe ser true o false').isBoolean(),
    validarCampos
], actualizarCurso);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarCurso);


// Exportamos el modulo
module.exports = router;