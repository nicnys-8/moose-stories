"use strict";

var GameState = require("./game-state"),
    GameController = require("./game-controller"),
    ObjectFactory = require("./objects/object-factory"),
    Camera = require("./camera"),
    Keyboard = require("./keyboard"),
    Levels = require("./levels"),
    AudioFactory = require("./audio-factory"),
    config = require("./config"),
    canvas = document.getElementById("view"),
    camera = new Camera(),
    keyboard = new Keyboard(),
    gameController = new GameController(canvas, camera, keyboard),
    controlledCharacterUID = 0,
    audio = AudioFactory.createSound("audio/fnurk.mp3");

GameState.parseLevel(Levels.level1);
gameController.startGame();
