/**
 * Describes the behavior of an object that can move and jump.
 */

"use strict";

var Behaviors = require("../behaviors"),
    Audio = require("../audio"),
    jumpSound = new Audio("audio/jump.wav"),
    landSound = new Audio("audio/land.wav"),
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

behavior.dependencies = ["Moving", "HasAnimation"];

/**
* Returns the public variables and methods associated with this behavior.
* @return {object} An object containing behavior variables and methods.
*/
behavior.getProperties = function() {
    return {
        // Variables
        isControllable: true,
        animations: {
            stand: null,
            walk: null,
            jump: null
        },

        // Functions
        moveLeft: moveLeft,
        moveRight: moveRight,
        jump: jump,
        cancelJump: cancelJump
    };
};

Behaviors.register("Platform", behavior);
