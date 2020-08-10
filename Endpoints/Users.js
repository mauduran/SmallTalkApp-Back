const express = require('express');
const router = express.Router();
const User = require('../DB/users');
const Login = require('../DB/login');
const bcrypt = require('bcryptjs');
const db = require('../DB/mongoDB-connection');
const dummyUsers = require('../Dummies/dummyUsers');
const mongoose = require('../DB/mongoDB-connection');

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
            req.status(400).json("Incorrect form submission");
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
                        res.json(user);
                        await session.commitTransaction();
                        return
                    })
                    .catch(async error => {
                        await session.abortTransaction();
                        res.status(400).json("unable to register");
                        console.log(error)
                    })
            })
            .catch(async error => {
                await session.abortTransaction();
                res.status(400).json("unable to register");
                console.log(error)
            })
    })

    .get(async (req, res) => {

        User.find({}, (err, docs) => {
            console.log(docs);
            res.status(201).json("OK");
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