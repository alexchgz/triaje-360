// RUTA BASE: /api/cursos

const { Router } = require('express');
const { getEjerciciosUsuario, crearEjercicioUsuario } = require('../controllers/ejerciciosUsuario');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// definimos las rutas
router.get('/', [
    validarJWT,
    // comprobamos campos opcionales
    check('idUsuario', 'El id debe ser válido').isMongoId(),
    check('idEjercicio', 'El id debe ser válido').isMongoId(),
    validarCampos
], getEjerciciosUsuario);

router.post('/', [
    validarJWT,
    // check('idUsuario', 'El id debe ser válido').optional().isMongoId(),
    // check('idEjercicio', 'El id debe ser válido').optional().isMongoId(),
    validarCampos
], crearEjercicioUsuario);


// Exportamos el modulo
module.exports = router;