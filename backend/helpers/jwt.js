// libreria JWT
const jwt = require('jsonwebtoken');

// funcion para generar el token
const generarJWT = (uid, rol) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid,
            rol
        }
        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: '24h',
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
}

//exportamos
module.exports = { generarJWT };