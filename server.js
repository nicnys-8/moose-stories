"use strict";

// Load required modules
var http = require("http"),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    fs = require("fs"),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    ExpressSession = require('express-session'),
    config = require("./config/config.js"),
    strategies = require('./config/strategies'),
    routes = require('./app/routes/index'),
    MongoStore = require("connect-mongo")(ExpressSession),
    sessionStore = new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    session = ExpressSession({
        secret: config.cookie.secret,
        key: config.cookie.name,
        store: sessionStore,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: config.cookie.maxAge
        }
    });

// Connect to the database
mongoose.connect(config.db);

// Set up session and authentication middleware
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
strategies(passport, config);

// Give the client side logic access to user data
app.use(function(req, res, next) {
    if (req.user) {
        res.locals.user = {
            admin: req.user.admin,
            username: req.user.username
        };
    } else {
        res.locals.user = null;
    }
    next();
});

// View engine setup
app.set('views', __dirname + '/app/views');
app.set('view engine', config.templateEngine);

// Use flash to display messages in templates
app.use(flash());

// Set up request data parsing
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Set up routes
app.use(express.static(__dirname + "/public"));
app.use('/', routes);


// Start Express http server
app.listen(config.port);

console.log("Server listening on port " + config.port);
