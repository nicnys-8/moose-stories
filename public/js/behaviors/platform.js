/**
 * Behavior describing a platform character
 */

"use strict";

var Behaviors = require("./../behaviors"),
    AudioFactory = require("./../audio-factory"),
    jumpSound = AudioFactory.createSound("audio/jump.wav"),
    landSound = AudioFactory.createSound("audio/land.wav");

function jump() {
    this.vSpeed = -5;
    jumpSound.play();
}


//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Moving", "FaceDirection"];

behavior.getProperties = function() {
    return {
        jump: jump
    };
};

behavior.tick = function(gameState) {
    if (this.onGround && !this.wasOnGround) {
        landSound.play();
    }
};

Behaviors.register("Platform", behavior);
