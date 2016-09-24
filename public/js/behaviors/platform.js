/**
 * Describes the behavior of a platform object that can be controlled by the
 * player.
 */

"use strict";

var Behaviors = require("./../behaviors"),
    AudioFactory = require("./../audio-factory"),
    jumpSound = AudioFactory.createSound("audio/jump.wav"),
    landSound = AudioFactory.createSound("audio/land.wav"),
    standardXForce = 12,
    jumpForce = 200;

function moveLeft() {
    this.applyForceX(-standardXForce);
}

function moveRight() {
    this.applyForceX(standardXForce);
}

function jump() {
    if (this.onGround) {
        this.applyForceY(-jumpForce);
        jumpSound.play();
    }
}

//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Moving"];

behavior.getProperties = function() {
    return {
        // Variables
        isControllable: true,

        // Functions
        moveLeft: moveLeft,
        moveRight: moveRight,
        jump: jump
    };
};

behavior.tick = function(gameState) {
};

Behaviors.register("Platform", behavior);
