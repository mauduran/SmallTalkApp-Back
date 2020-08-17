const express = require('express');
const router = express.Router();
const UserControllers = require('./Controllers/UserControllers');

const {requireAuth} = require('../Middlewares/authorizarion');

router.route('/')
    .get(UserControllers.GetUsersController);

router.route('/user')
    .get(requireAuth, UserControllers.GetUserById);

router.route('/register')
    .post(UserControllers.UserRegisterController)
    .get(requireAuth, (req, res)=>{
        res.json("This is ok");
    })


router.route('/login')
    .post(UserControllers.UserLoginController)


router.route('/:userId')
    .get(UserControllers.GetUserById);


module.exports = router;