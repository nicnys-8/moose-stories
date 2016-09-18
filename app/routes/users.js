'use strict';

var express = require('express'),
    router = express.Router(),
    User = require('../models/user');

/**
 * Generates a JSON representation of a specified user with sensitive data
 * stripped away, such that it is suitable for public display.
 * @param {User} user - The Mongoose User document to base the new object on
 */
function strip(user) {
    return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        _id: user._id
    };
}

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(400).send('Access denied.');
    }
}

function isAdmin(req, res, next) {
    if (req.user.admin) {
        next();
    } else {
        res.status(400).send('Access denied.');
    }
}

module.exports = function(passport) {

    router.get('/', isAuthenticated, function(req, res) {

        User.find(function(err, users) {
            var result = [];
            var i;
            if (err) {
                //TODO: Error handling
            }
            if (!users) {
                res.send(null);
            }
            for (i = 0; i < users.length; i++) {
                result.push(strip(users[i]));
            }
            res.json(result);
        });
    });

    router.get('/:userId', isAuthenticated, function(req, res) {
        var query = {
            _id: req.params.userId
        };

        User.findOne(query, function(err, user) {
            if (err) {
                //TODO: Error handling
            } else if (!user) {
                res.send(null);
            } else {
                res.json(strip(user));
            }
        });
    });

    router.delete('/:userId', isAdmin, function(req, res) {
        var query = {
            _id: req.params.userId
        };

        User.remove(query, function(err) {
            if (err) {
                res.status(404).send('Error');
            } else {
                res.send('OK');
            }
        });
    });

    return router;
};
