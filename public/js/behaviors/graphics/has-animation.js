/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

const Behaviors = require("../../behaviors");

/**
 * Renders the object.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
 */
function render(ctx) {
	if (this.currentAnimation) {
		this.currentAnimation.render(ctx, this.position, this.scale, this.rotation, this.alpha);
	}
}


//=================
// Public interface
//=================

const behavior = {};

behavior.dependencies = ["Renderable"];

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
	return {
		// Variables
		currentAnimation: null,

		// Functions
		render: render // Overwrites the inherited function
	};
};

/**
 * Updates the state of the target object.
 */
behavior.tick = function() {
	if (this.currentAnimation && this.currentAnimation.imageSpeed > 0) {
		this.currentAnimation.tick();
	}
};

Behaviors.register("HasAnimation", behavior);
