const {getAuthTokenId} = require('../Utils/session.utils');

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) return res.status(401).json('Unauthorized');

    return getAuthTokenId(req, res, next);
}

module.exports = {
    requireAuth
}