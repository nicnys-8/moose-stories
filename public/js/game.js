"use strict";

var gameState = require("./game-state"),
    gameController = require("./game-controller"),
    camera = require("./camera"),
    keyboard = require("./keyboard"),
    Levels = require("./levels"),
    config = require("./config"),
    canvas = document.getElementById("view");

gameState.parseLevel(Levels.level1);
gameController.setCanvas(canvas);
gameController.startGame();
