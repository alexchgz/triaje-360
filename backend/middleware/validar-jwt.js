// importamos la libreria
const jwt = require('jsonwebtoken');

// definimos la funcion para validar el jwt
const validarJWT = (req, res, next) => {
    // almacenamos el token desde el header de la peticion
    const token = req.header('x-token');

    // comprobamos si está el token
    if (!token) {
        return res.status(400).json({
            ok: false,
            msg: 'Falta token de autorización'
        });
    }

    // si está -> 
    try {
        // extraemos uid y rol del payload
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);
        // y los asignamos al req
        req.uid = uid;
        req.rol = rol;
        next();
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
}

// exportamos
module.exports = { validarJWT };