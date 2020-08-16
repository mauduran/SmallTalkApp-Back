const jwt = require('jsonwebtoken');
const {
    addFieldToHashTable,
    getFieldFromHashTable
} = require('../Utils/redis.utils');

const User = require('../DB/users');
const Login = require('../DB/login');
const bcrypt = require('bcryptjs');

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
            console.log(err);
            return Promise.reject(err);
        })
}

const getAuthTokenId = (req, res, next) => {
    const {
        authorization
    } = req.headers;
    const token = getTokenFromAuthString(authorization);

    getFieldFromHashTable('jwt', token)
        .then(resp => {
            if(next) {
                req.params.userId = resp.data;
                return next();
            }
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

const handleSignInCredentials = async (req) => {
    let { email, username, password } = req.body;
    if (email) email = email.toLowerCase();
    if (username) username = username.toLowerCase();


    if ((!email && !username) || !password) {
        return Promise.reject('Missing fields');
    }
    let user = null;
    try {
        user = await User.findOne({ $or: [{ username }, { email }] })
    } catch (error) {
        console.log(error);
        return Promise.reject('Unexpected Error');
    }

    if (!user) {
        return Promise.reject('Wrong credentials');
    }

    let validCredentials = null;
    try {
        const userCredentials = await Login.findOne({ userId: user._id })
        validCredentials = bcrypt.compareSync(password, userCredentials.hash);
    } catch (error) {
        console.log(error);
    }

    return validCredentials ? Promise.resolve(user) : Promise.reject('Wrong credentials');
}


const findUser = async (username, email) => {
    return await User.findOne({ $or: [{ username: username }, { email: email }] });
}

const findUserById = async (id) => {
    return await User.findById(id);
}

const findUsers = async (searchQuery) => {
    if (searchQuery) {
        return await User.find({ $or: [{ username: {$regex : `.*${searchQuery}.*`} }, { email: {$regex : `.*${searchQuery}.*`} }] });
    }
    return await User.find({});
}

module.exports = {
    createSession,
    getAuthTokenId,
    findUser,
    findUsers,
    findUserById,
    handleSignInCredentials
}