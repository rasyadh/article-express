const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = passport => {
    // Local Strategy
    passport.use(new LocalStrategy((username, password, done) => {
        // Match Username
        User.findOne({ username })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'No user found' });
                }

                // Match Password
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, { message: 'Wrong password' });
                        }
                    })
                    .catch(err => {
                        throw err;
                    })
            })
            .catch(err => {
                throw err;
            });
    }));

    passport.serializeUser((user, done) => done(null, user._id));
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
}