// RUTA BASE: /api/acciones

const { Router } = require('express');
const { getAcciones, crearAccion, actualizarAccion, borrarAccion } = require('../controllers/acciones');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// definimos las rutas
router.get('/', [
    validarJWT,
    // comprobamos campos opcionales
    check('id', 'El id debe ser válido').optional().isMongoId(),
    validarCampos
], getAcciones);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('tiempo', 'El argumento tiempo es obligatorio').isNumeric(),
    validarCampos
], crearAccion);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('tiempo', 'El argumento tiempo es obligatorio').isNumeric(),
    validarCampos
], actualizarAccion);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarAccion);


// Exportamos el modulo
module.exports = router;