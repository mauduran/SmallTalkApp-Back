
const User = require('../../DB/users');
const Login = require('../../DB/login');
const db = require('../../DB/mongoDB-connection');
const bcrypt = require('bcryptjs');
const { findUser, findUsers, createSession, getAuthTokenId, handleSignInCredentials } = require('../../Utils/session.utils');


const UserRegisterController = async (req, res) => {
    let {
        firstName,
        lastName,
        email,
        username,
        password
    } = req.body


    if (!firstName || !lastName || !email || !username || !password) {
        let response = {
            success: false,
            error: "Missing fields"
        }
        res.status(400).json(response);
        return;
    }

    email = email.toLowerCase();
    username = username.toLowerCase();

    const userFound = await findUser(username, email);

    if (userFound) {
        let response = {
            success: false,
            error: "Username or email already in use"
        }
        res.status(409).json(response);
        return
    }

    const session = await db.startSession();
    session.startTransaction();

    await User.createCollection();
    await Login.createCollection();

    let newUser = {
        firstName,
        lastName,
        email: email.toLowerCase(),
        username: username.toLowerCase()
    };

    let userDocument = User(newUser);

    userDocument.save({ session })
        .then(async user => {
            let newLogin = {
                userId: user._id,
                hash: bcrypt.hashSync(password, 10)
            }

            let loginDocument = Login(newLogin);
            loginDocument.save({ session })
                .then(async login => {
                    let response = {
                        success: true,
                        user: user
                    }
                    try {
                        const userSession = await createSession(user);
                        res.json({ ...response, token: userSession.token })
                    } catch (error) {
                        res.json(response);
                    }

                    await session.commitTransaction();
                    return
                })
                .catch(async error => {
                    await session.abortTransaction();
                    let response = {
                        success: false,
                        error: "Unable to register"
                    }
                    res.status(400).json(response);
                    console.log(error)
                    return;
                })
        })
        .catch(async error => {
            await session.abortTransaction();
            let response = {
                success: false,
                error: "Unable to register"
            }
            res.status(400).json(response);
            console.log(error)
            return;
        })
}

const UserLoginController = async (req, res) => {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenId(req, res) :
        handleSignInCredentials(req)
            .then(user => {
                return (user._id && user.username) ? createSession(user) : Promise.reject(user)

            })
            .then(session => {
                return res.json(session)
            })
            .catch(err => {
                return res.status(400).json({ error: err })
            })
}

const GetUsersController = async (req, res) => {
    let searchInput = req.query.searchInput;

    if(searchInput) searchInput = searchInput.toLowerCase();
    let users = []
    try {
        users = await findUsers(searchInput);
        console.log(users);
    } catch (error) {
        console.log(error);
    }

    res.json(users);
}

const GetUserById = async (req, res) => {
    const userId = req.params.userId;
    
    if(!userId){
        res.status(400).json({});
        return;
    }

    let user = null;

    try {
        user = await User.findById(userId);
    } catch (error) {
        console.log(error);
    }

    console.log(user);

    res.json(user);
}


module.exports = {
    UserRegisterController,
    UserLoginController,
    GetUsersController,
    GetUserById
}