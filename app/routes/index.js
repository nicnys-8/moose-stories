'use strict';

var express = require('express'),
    router = express.Router(),
    UserRoutes = require('./users');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function isAdmin(req, res, next) {
    if (req.user.admin) {
        return next();
    }
    res.redirect('/access-denied');
}

module.exports = function(passport) {

    router.get('/', isAuthenticated, function(req, res) {
        res.render('lobby');
    });

    router.get('/login', function(req, res) {
        res.render('login', {
            message: req.flash('message')
        });
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/lobby',
        failureRedirect: '/',
        failureFlash: true
    }));

    router.get('/signup', function(req, res) {
        res.render('signup', {
            message: req.flash('message')
        });
    });

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/lobby',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.get('/lobby', isAuthenticated, function(req, res) {
        res.render('lobby');
    });

    router.get('/game', isAuthenticated, function(req, res) {
        res.render('game');
    });

    router.get('/editor', isAuthenticated, function(req, res) {
        res.render('editor');
    });

    router.get('/admin', isAuthenticated, isAdmin, function(req, res) {
        res.render('admin');
    });

    router.get('/access-denied', isAuthenticated, function(req, res) {
        res.render('access-denied');
    });

    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // Add the remaining roots
    router.use('/users', UserRoutes(passport));

    return router;
};
