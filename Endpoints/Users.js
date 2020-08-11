const express = require('express');
const router = express.Router();
const User = require('../DB/users');
const Login = require('../DB/login');
const bcrypt = require('bcryptjs');
const db = require('../DB/mongoDB-connection');
const dummyUsers = require('../Dummies/dummyUsers');
const mongoose = require('../DB/mongoDB-connection');
const { addFieldToHashTable, removeFieldFromHashTable, getFieldFromHashTable } = require('../Utils/redis.utils');

router.route('/')
    .get((req, res) => {
        const searchInput = req.query.searchInput.toLowerCase();
        const users = dummyUsers.getDummyUsers();

        const usersFound = users.filter(user => user.name.toLowerCase().includes(searchInput) ||
            user.username.toLowerCase().includes(searchInput));

        res.json(usersFound);
    });

router.route('/register')
    .post(async (req, res) => {
        const {
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

        let existingUser = await User.findOne({ username });
        existingUser = existingUser ? existingUser : await User.findOne({ email });
        console.log(existingUser);
        if (existingUser) {
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
            email,
            username
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
                        res.json(response);
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
    })


router.route('/login')
    .post(async (req, res) => {

    })
    .get((req, res) => {
        getFieldFromHashTable('jwt', 987)
            .then(resp => {
                console.log(resp.data);
                res.json("OK");
            })
            .catch(err => {
                console.log("Unexpected Error");
                res.status(400).json(err);
            })
    })


router.route('/:userId')
    .get((req, res) => {
        const userId = req.params.userId;

        const users = dummyUsers.getDummyUsers();

        const user = users.find(usr => usr.userId == userId);

        res.json(user);
    });



module.exports = router;