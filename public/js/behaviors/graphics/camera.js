/**
 * Describes a camera object.
 */

"use strict";

const Behaviors = require("../../behaviors");


//=================
// Public interface
//=================

const behavior = {};

behavior.dependencies = ["Transform"];

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
	return {
		sensitivity: 0.2,
		offset: {x: 0, y: -96},

		/** @type {GameObject} */
		target: null
	};
};

/**
 * Updates the state of the target object.
 *
 * @param {GameState} gameState - Object defining the game's current state.
 */
behavior.tick = function(gameState, windowWidth = 0, windowHeight = 0) {
	const xDistance = (this.target.position.x + this.offset.x) - this.position.x;
	const yDistance = (this.target.position.y + this.offset.y) - this.position.y;

	this.position.x += xDistance * this.sensitivity;
	this.position.y += yDistance * this.sensitivity;

	// Keep the camera from moving outside the level
	this.position.x = Math.max(this.position.x, windowWidth / 2);
	this.position.y = Math.max(this.position.y, windowHeight / 2);
	this.position.x = Math.min(this.position.x, gameState.getWidth() - windowWidth / 2);
	this.position.y = Math.min(this.position.y, gameState.getHeight() - windowHeight / 2);
};


Behaviors.register("Camera", behavior);
