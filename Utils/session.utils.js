const jwt = require('jsonwebtoken');
const { addFieldToHashTable, getFieldFromHashTable } = require('../Utils/redis.utils');
const { response } = require('express');

const getTokenFromAuthString = (auth) => {
    const authArray = auth.split(" ");
    return authArray[1];
}

const setToken = (token, id) => {
    const response = addFieldToHashTable('jwt', token, 'id');

    if (response.error) {
        return Promise.reject(response.error);
    }
    return Promise.resolve(response.id);
}

const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;
    const token = getTokenFromAuthString(authorization);

    getFieldFromHashTable('jwt', token)
        .then(resp => {
            res.json({ id: resp.data })
            return;
        })
        .catch(err => {
            res.status(401).json("Unauthorized");
            return;
        })

}

const signToken = (email, username) => {
    return jwt.sign({
        email,
        username
    }, "ReacttcaeR", { expiresIn: "1 days" })
}


const createSession = (token, userObj) => {
    const newToken = signToken(userObj.email ,userObj.username);
    
}


const createSession = () => {

}