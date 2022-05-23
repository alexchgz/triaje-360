// RUTA BASE: /api/actividades

const { Router } = require('express');
const { getActividades, crearActividad, actualizarActividad, borrarActividad } = require('../controllers/actividades');
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
], getActividades);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('tiempo', 'El argumento tiempo es obligatorio').isNumeric(),
    check('momento', 'El argumento momento es obligatorio').isString(),
    check('ejercicioUsuario', 'El argumento ejercicioUsuario es obligatorio').isMongoId(),
    check('paciente', 'El argumento paciente es Id').optional().isMongoId(),
    check('color', 'El argumento color es string').optional().isString(),
    check('accion', 'El argumento paciente es Id').optional().isMongoId(),
    validarCampos
], crearActividad);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('tiempo', 'El argumento tiempo es obligatorio').isNumeric(),
    check('momento', 'El argumento momento es obligatorio').isString(),
    check('ejercicioUsuario', 'El argumento ejercicioUsuario es obligatorio').isMongoId(),
    check('paciente', 'El argumento paciente es obligatorio').optional().isMongoId(),
    check('color', 'El argumento color es string').optional().isString(),
    check('accion', 'El argumento paciente es Id').optional().isMongoId(),
    validarCampos
], actualizarActividad);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarActividad);


// Exportamos el modulo
module.exports = router;