/**
 * Describes a camera object.
 */

"use strict";

const Behaviors = require("../../behaviors");
const behavior = {};

behavior.dependencies = ["Transform"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function() {

	const sensitivity = 0.2;
	const offset = {x: 0, y: -96};

	let target = null;

	/**
	* Set target object for the camera to follow.
	*
	* @param {GameObject} obj - The new target object.
	*/
	this.setTarget = function(obj) {
		target = obj;
	};

	/**
	 * Add function for updating the object.
	 */
	this.onUpdate((gameState, windowWidth = 0, windowHeight = 0) => {
		const xDistance = (target.position.x + offset.x) - this.position.x;
		const yDistance = (target.position.y + offset.y) - this.position.y;

		this.position.x += xDistance * sensitivity;
		this.position.y += yDistance * sensitivity;

		// Keep the camera from moving outside the level
		this.position.x = Math.max(this.position.x, windowWidth / 2);
		this.position.y = Math.max(this.position.y, windowHeight / 2);
		this.position.x = Math.min(this.position.x, gameState.getWidth() - windowWidth / 2);
		this.position.y = Math.min(this.position.y, gameState.getHeight() - windowHeight / 2);
	});

};


Behaviors.register("Camera", behavior);
