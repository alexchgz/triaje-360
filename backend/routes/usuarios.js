// RUTA BASE: /api/usuarios

const { Router } = require('express');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');

const router = Router();
router.get('/', getUsuarios);

router.post('/', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos,
    validarRol
], crearUsuario);

router.put('/:id', [
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    // check('password', 'El argumento password es obligatorio').not().isEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRol
], actualizarUsuario);

router.delete('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuario);

// Exportamos el modulo
module.exports = router;