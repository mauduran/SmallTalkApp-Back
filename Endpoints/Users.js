const express = require('express');
const router = express.Router();

const UserControllers = require('./Controllers/UserControllers');

router.route('/')
    .get(UserControllers.GetUsersController);

router.route('/register')
    .post(UserControllers.UserRegisterController);


router.route('/login')
    .post(UserControllers.UserLoginController)


router.route('/:userId')
    .get(UserControllers.GetUserById);


module.exports = router;