// RUTA BASE: /api/acciones

const { Router } = require('express');
const { getImagenes, crearImagen, actualizarImagen, borrarImagen } = require('../controllers/imagenes');
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
], getImagenes);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').isString(),
    check('descripcion', 'El argumento descripcion es obligatorio').isString(),
    validarCampos
], crearImagen);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').isString(),
    check('descripcion', 'El argumento descripcion es obligatorio').isString(),
    validarCampos
], actualizarImagen);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarImagen);


// Exportamos el modulo
module.exports = router;