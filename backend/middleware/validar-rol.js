const { response } = require('express');
const roles = ['ROL_ALUMNO', 'ROL_PROFESOR', 'ROL_ADMIN'];

const validarRol = (req, res = response, next) => {
    const rol = req.body.rol;

    //comprobamos el rol
    if (rol && !roles.includes(rol)) {
        return res.status(400).json({
            ok: false,
            msg: 'Rol no permitido'
        });
    }
    next();
}

// Exportamos
module.exports = { validarRol };