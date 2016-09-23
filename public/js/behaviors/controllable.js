/**
 * Describes the behavior of a platform object that can be controlled by the
 * player.
 */

 "use strict";

//================================
// Private functions and variables
//================================

var Behaviors = require("./../behaviors"),
	wasMoved = false,
    standardAcceleration = 0.5;

function moveLeft() {
    wasMoved = true;
    this.hAcceleration = -standardAcceleration;
}

function moveRight() {
    wasMoved = true;
    this.hAcceleration = standardAcceleration;
}


//=================
// Public interface
//=================

var behavior = {};

behavior.getProperties = function() {
    return {
        // Variables
        isControllable: true,

        // Functions
        moveLeft: moveLeft,
        moveRight: moveRight
    };
};

behavior.tick = function(gameState) {
    if (!wasMoved) {
        this.hAcceleration = -this.hSpeed / 5;
    }
    wasMoved = false;
};

Behaviors.register("Controllable", behavior);
