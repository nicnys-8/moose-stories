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
		// Variables
		sensitivity: 0.2,
		offset: {
			x: 0,
			y: -96
		},
		/** @type {GameObject} */
		target: null
	};
};

/**
 * Updates the state of the target object.
 */
behavior.tick = function() {
	const xDistance = (this.target.position.x + this.offset.x) - this.position.x,
		yDistance = (this.target.position.y + this.offset.y) - this.position.y;

	this.position.x += xDistance * this.sensitivity;
	this.position.y += yDistance * this.sensitivity;
};


Behaviors.register("Camera", behavior);
