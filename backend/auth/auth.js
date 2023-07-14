const jwt = require('jsonwebtoken')
const config = require('../../config/config')
const BackendError = require('../util/BackendError')

const jwtPrivateKey = config['jwtPrivateKey']

const usersStore = require('../user/store')

module.exports = async function (req, res, next) {

    // const token = req.cookies['x-auth-token'] || req.header('x-auth-token')
    const token = req.cookies['x-auth-token']

    if (!token) {
        throw new BackendError("Authentication failed. No token provided.",401)
    }

    let payload = undefined

    try {
        payload = jwt.verify(token, jwtPrivateKey)
    }
    catch(error) {
        throw new BackendError("Authentication failed. Invalid token.",401,error)
    }

    req.auth = {
        user: await usersStore.getUserById(payload.userId)
        // rights: users.getRightInfos()            // TODO: Über das users objekt können später so sachen wie User Rechte geladen und an die req chain übergeben werden.
    }

    if(typeof req.auth.user === 'undefined' || req.auth.user == null) {
        res.clearCookie('x-auth-token')
        res.status(401).send({})
    }

    next()
}
