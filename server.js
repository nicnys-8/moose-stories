"use strict";

// Load required modules
var http = require("http"),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    fs = require("fs"),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.use('/', routes);

var levels = {};

function loadLevels() {

    var levelFiles = fs.readdirSync(__dirname + "/public/levels"),
        i, filename, level;

    for (i in levelFiles) {
        filename = levelFiles[i];

        console.log("Found level " + filename);

        try {
            level = require(__dirname + "/public/levels/" + filename);
            levels[filename.split(".")[0]] = level;
            console.log("Loaded level " + filename);
        } catch (err) {
            console.log("Failed to load level " + filename);
        }
    }
}
loadLevels();

var sprites = [];
var backgrounds = [];

function loadPaths(dst, dir, sub) {

    var path = __dirname + '/public/' + dir + sub,
        files = fs.readdirSync(path),
        i, filename, stats;

    for (i in files) {
        filename = files[i];
        stats = fs.lstatSync(path + "/" + filename);

        if (stats.isDirectory()) {
            loadPaths(dst, dir, sub + filename + "/");
        } else {
            dst.push(dir + sub + filename);
        }
    }
}
loadPaths(sprites, "/img/sprites", "/");
loadPaths(backgrounds, "/img/backgrounds", "/");

app.get("/sprites", function(req, res) {
    res.send(sprites);
});
app.get("/backgrounds", function(req, res) {
    res.send(backgrounds);
});
app.get("/levels", function(req, res) {
    res.send(levels);
});

app.post("/save", function(req, res) {
    var name = req.body.name,
        firstName = name.split(".")[0],
        filename = firstName + ".json",
        path = __dirname + "/levels/" + filename;

    levels[firstName] = req.body.level;

    // TODO: Validate level data and so on and so forth...
    fs.writeFile(path,
        JSON.stringify(req.body.level, null, 4),
        function(err) {
            if (err) {
                console.log(err);
                res.status(418).send("Sorry :)");
            } else {
                console.log("Level saved to " + path);
                res.send(filename);
            }
        });
});

// Start Express http server on port 8080
var webServer = http.createServer(app).listen(config.port);

console.log("Server listening on port " + config.port);
