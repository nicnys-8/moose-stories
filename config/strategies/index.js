'use strict';

var User = require('../../app/models/user'),
	path = require('path');

module.exports = function(passport, config) {

    // Passport needs to be able to serialize and deserialize users to support
    // persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    require("./local")(passport);

    return passport;
};
