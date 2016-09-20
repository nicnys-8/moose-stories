"use strict";

var GameState = require("./game-state"),
    GameController = require("./game-controller"),
    Camera = require("./camera"),
    Keyboard = require("./keyboard"),
    Levels = require("./levels");

// Move this somewhere else:
require("./objects/game-object");
require("./objects/block");
require("./objects/characters/character");
require("./objects/characters/giri");

var canvas = document.getElementById("view"),
    state = new GameState(),
    camera = new Camera(),
    keyboard = new Keyboard(),
    gameController = new GameController(state, canvas, camera, keyboard),
    controlledCharacterUID = 0,
    AudioFactory = require('./audio-factory'),
    audio = AudioFactory.createSound("audio/fnurk.mp3");

state.parseLevel(Levels.level1);

//=====================
// Handle mouse presses
//=====================

document.body.onmousedown = function(event) {
    var x = camera.x + event.offsetX - canvas.width / 2;
    var y = camera.y + event.offsetY - canvas.height / 2;

    var block = ObjectFactory.createObject({
        name: "Block",
        x: 32 * Math.round(x / 32),
        y: 32 * Math.round(y / 32),
    });
    state.addObject(block);
};


//====================
// Start the game loop
//====================

gameController.startGame();
