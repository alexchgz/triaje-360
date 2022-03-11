// RUTA BASE: /api/usuarios

const { Router } = require('express');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();
router.get('/', [
    validarJWT,
    // comprobamos campos opcionales
    check('id', 'El id debe ser válido').optional().isMongoId(),
    check('pageSize', 'Desde debe ser un número').optional().isNumeric(),
    check('currentPage', 'Desde debe ser un número').optional().isNumeric(),
    check('role', 'Desde debe ser una cadena de texto').optional().isString(),
    check('texto', 'Desde debe ser un objeto').optional().isString(),
    check('idsUsuAsignados', 'Desde debe ser un objeti').optional().isString(),
    validarCampos
], getUsuarios);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    check('activo', 'El estado debe ser true o false').optional().isBoolean(),
    validarCampos,
    validarRol
], crearUsuario);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento debe ser un email').isEmail(),
    check('id', 'El identificador no es válido').isMongoId(),
    // opcionales
    check('activo', 'El estado debe ser true o false').optional().isBoolean(),
    validarCampos,
    validarRol
], actualizarUsuario);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuario);

// Exportamos el modulo
module.exports = router;