/**
 * Describes the behavior of an object that can move and jump.
 */

"use strict";

var Behaviors = require("./../behaviors"),
    AudioFactory = require("./../audio-factory"),
    jumpSound = AudioFactory.createSound("audio/jump.wav"),
    landSound = AudioFactory.createSound("audio/land.wav"),
    moveForce = 12,
    jumpForce = 200;

function moveLeft() {
    this.applyForceX(-moveForce);
}

function moveRight() {
    this.applyForceX(moveForce);
}

function jump() {
    if (this.onGround) {
        this.applyForceY(-jumpForce);
        jumpSound.play();
    }
}

function cancelJump() {
    if (this.speed.y < 0) {
        this.speed.y /= 2;
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
        jump: jump,
        cancelJump: cancelJump
    };
};

behavior.tick = function(gameState) {
};

Behaviors.register("Platform", behavior);
