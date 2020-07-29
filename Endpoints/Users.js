const express = require('express');
const router = express.Router();

const dummyUsers = require('../Dummies/dummyUsers');

router.route('/')
    .get((req, res) => {
        const searchInput = req.query.searchInput.toLowerCase();
        const users = dummyUsers.getDummyUsers();

        const usersFound = users.filter(user => user.name.toLowerCase().includes(searchInput)
        || user.username.toLowerCase().includes(searchInput));

        res.json(usersFound);
    });

router.route('/:userId')
    .get((req, res) => {
        const userId = req.params.userId;

        const users = dummyUsers.getDummyUsers();

        const user = users.find(usr => usr.userId==userId);

        res.json(user);
    });

module.exports = router; 