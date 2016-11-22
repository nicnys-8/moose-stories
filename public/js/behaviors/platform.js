/**
 * Describes the behavior of an object that can move and jump.
 */

"use strict";

//=========================
// Private static variables
//=========================

const Behaviors = require("../behaviors");
const GameObject = require("../game-object");
const behavior = {};

const jumpForce = 220;
const moveForce = 12;

const jumpSound = new GameObject("Audio", {
	name: "Jump"
});
const landSound = new GameObject("Audio", {
	name: "Land"
});


//=================
// Static functions
//=================

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


//====================
// Define the behavior
//====================

behavior.dependencies = ["Moving", "HasAnimation"];

/**
 * Function that is called on an object when this behavior is added to it.
 */
behavior.init = function() {

	this.isControllable = true;
	this.animations = {
		stand: null,
		walk: null,
		jump: null
	};

	/** @type {function} */
	this.moveLeft   = moveLeft;
	this.moveRight  = moveRight;
	this.jump       = jump;
	this.cancelJump = cancelJump;
};

Behaviors.register("Platform", behavior);
