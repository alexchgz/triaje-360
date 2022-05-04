const { Router } = require('express');
const { getPacientesEjercicio, crearPacienteEjercicio, actualizarPacienteEjercicio, borrarPacienteEjercicio } = require('../controllers/pacienteEjercicio');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// definimos las rutas
router.get('/', [
    validarJWT,
    // comprobamos campos opcionales
    check('idEjercicio', 'El id debe ser válido').isMongoId(),
    validarCampos
], getPacientesEjercicio);

router.post('/', [
    validarJWT,
    check('idPaciente', 'El id debe ser válido').isMongoId(),
    check('idEjercicio', 'El id debe ser válido').isMongoId(),
    check('idImagen', 'El id debe ser válido').isMongoId(),
    check('x', 'x debe ser válido').isNumeric(),
    check('y', 'y debe ser válido').isNumeric(),
    validarCampos
], crearPacienteEjercicio);

router.put('/:id', [
    validarJWT,
    check('idPaciente', 'El id debe ser válido').isMongoId(),
    check('idEjercicio', 'El id debe ser válido').isMongoId(),
    check('idImagen', 'El id debe ser válido').isMongoId(),
    check('x', 'x debe ser válido').isNumeric(),
    check('y', 'y debe ser válido').isNumeric(),
    validarCampos
], actualizarPacienteEjercicio);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarPacienteEjercicio);

// Exportamos el modulo
module.exports = router;