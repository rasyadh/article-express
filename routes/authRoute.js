const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * @route       /auth/register
 * @method      GET
 * @description Show register form
 */
router.get('/register', (req, res) => {
    res.render('auth/register', {
        header: 'Register'
    });
});

/**
 * @route       /auth/register
 * @method      POST
 * @description Registering new user
 */
router.post('/register', (req, res) => {
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty()
        .isEmail().withMessage('Email is not valid');
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Password do not matched').equals(req.body.password);

    let errors = req.validationErrors();
    if (errors) {
        res.render('auth/register', {
            header: 'Register',
            errors
        });
    }
    else {
        let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        bcrypt.genSalt(10)
            .then(salt => {
                bcrypt.hash(newUser.password, salt)
                    .then(hash => {
                        newUser.password = hash;

                        newUser.save()
                            .then(() => {
                                req.flash('success', 'You are registered');
                                res.redirect('/auth/login');
                            })
                            .catch(err => console.error(err));
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    }
});

/**
 * @route       /auth/login
 * @method      GET
 * @description Show login form
 */
router.get('/login', (req, res) => {
    res.render('auth/login', {
        header: 'Login'
    });
});

module.exports = router;