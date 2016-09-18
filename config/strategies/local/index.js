'use strict';

var User = require('../../../app/models/user'),
    login = require('./login'),
    signup = require('./signup');

module.exports = function(passport) {

    // Setting up Passport Strategies for loggin in and registering
    login(passport);
    signup(passport);
};
