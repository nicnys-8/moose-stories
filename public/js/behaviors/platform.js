/**
 * Describes the behavior of an object that can move and jump.
 */

"use strict";


//==================
// Private variables
//==================

const Behaviors = require("../behaviors");
const GameObject = require("../game-object");

const jumpForce = 220;
const moveForce = 12;

const jumpSound = new GameObject("Audio", {
	name: "Jump"
});
const landSound = new GameObject("Audio", {
	name: "Land"
});

//==================
// Private functions
//==================

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

const behavior = {};

behavior.dependencies = ["Moving", "HasAnimation"];

/**
 * Defines the public variables and methods associated with this behavior.
 *
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
