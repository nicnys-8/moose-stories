'use strict';

var LocalStrategy = require('passport-local').Strategy,
    User = require('../../../app/models/user'),
    bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

    passport.use('local-signup', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            function findOrCreateUser() {
                // find a user in Mongo with provided username
                User.findOne({
                    'username': username
                }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: ' + username);
                        return done(null, false, req.flash('message', 'User Already Exists'));
                    } else {
                        // create the user
                        var newUser = new User();
                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.body.email;
                        newUser.firstName = req.body.firstName;
                        newUser.lastName = req.body.lastName;

                        // save the user
                        newUser.save(function(err) {
                            if (err) {
                                console.log('Error saving user: ' + err);
                                return done(null, false, req.flash('message', 'Error creating account.'));
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            }
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));

    // Generates hash using bCrypt
    function createHash(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

};
