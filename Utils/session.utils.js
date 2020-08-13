const jwt = require('jsonwebtoken');
const {
    addFieldToHashTable,
    getFieldFromHashTable
} = require('../Utils/redis.utils');
const {
    response
} = require('express');

const getTokenFromAuthString = (auth) => {
    const authArray = auth.split(" ");
    return authArray[1];
}

const setToken = (token, id) => {
    return addFieldToHashTable('jwt', token, id)
        .then(response => {
            return Promise.resolve(response)
        })
        .catch(err => {
            console.log(err)
            return Promise.reject(err)
        })
}

const getAuthTokenId = (req, res) => {
    const {
        authorization
    } = req.headers;
    const token = getTokenFromAuthString(authorization);

    getFieldFromHashTable('jwt', token)
        .then(resp => {
            res.json({
                id: resp.data
            })
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
    }, "ReacttcaeR", {
        expiresIn: "1 days"
    })
}


const createSession = (userObj) => {
    return new Promise((resolve, reject) => {
        const newToken = signToken(userObj.email, userObj.username);
        setToken(newToken, userObj._id)
            .then(() =>
                resolve({
                    success: true,
                    userId: userObj._id,
                    token: newToken,
                    username: userObj.username
                })
            )
            .catch((error) => {
                console.log(error)
                reject({
                    success: false,
                    ...error
                })
            })
    })
}

module.exports = {
    createSession,
    getAuthTokenId
}