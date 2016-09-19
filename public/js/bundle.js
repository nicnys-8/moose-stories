(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var canvas = document.getElementById("view"),
    state = new GameState(),
    camera = new Camera(),
    keyboard = new Keyboard(),
    gameController = new GameController(state, canvas, camera, keyboard),
    controlledCharacterUID = 0,
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

},{}]},{},[1]);
