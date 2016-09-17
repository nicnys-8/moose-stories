"use strict";

// Load required modules
var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var bodyParser = require("body-parser");
var fs = require("fs");
var config = require("./config/config.js");

var httpApp = express();

// parse application/x-www-form-urlencoded
httpApp.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
httpApp.use(bodyParser.json());

httpApp.use(express.static(__dirname + "/public"));

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

console.log(sprites);
console.log(backgrounds);

httpApp.get("/sprites", function(req, res) {
            res.send(sprites);
            });
httpApp.get("/backgrounds", function(req, res) {
            res.send(backgrounds);
            });
httpApp.get("/levels", function(req, res) {
            res.send(levels);
            });

httpApp.post("/save", function(req, res) {
             var name = req.body.name,
                 firstName = name.split(".")[0],
                 filename = firstName + ".json",
                 path = __dirname + "/levels/" + filename;

             levels[firstName] = req.body.level;

             // TODO: Validate level data and so on and so forth...
             fs.writeFile(path,
                          JSON.stringify(req.body.level, null, 4),
                          function(err) {
                            if(err) {
                                console.log(err);
                                res.status(418).send("Sorry :)");
                            } else {
                                console.log("Level saved to " + path);
                                res.send(filename);
                            }
                          });
            });

// Start Express http server on port 8080
var webServer = http.createServer(httpApp).listen(config.port);

console.log("Server listening on port " + config.port);
