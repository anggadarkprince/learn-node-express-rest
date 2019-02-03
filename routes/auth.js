const express = require('express');
const {body} = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// PUT /auth/signup
router.put('/signup', [
    body('name').trim().not().isEmpty().isLength({max: 50}),
    body('email').trim().isLength({max: 50})
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail()
        .custom((value, {req}) => {
            return User.findOne({email: value})
                .then(user => {
                    if (user) {
                        return Promise.reject('Email address already exist');
                    }
                })
        }),
    body('password').trim().isLength({max: 50}),
], authController.signup);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', isAuth, [
    body('status').trim().not().isEmpty()
], authController.updateUserStatus);

module.exports = router;