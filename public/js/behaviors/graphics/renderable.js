/**
 * Describes an object that can be rendered on the screen.
 */

"use strict";

const Behaviors = require("../../behaviors");
const behavior = {};

behavior.dependencies = ["Transform"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function() {

	/**
	* Transparency of the object, a value between 0 and 1.
	* @type {number}
	*/
	this.alpha = 1;

	/**
	 * Renders the object.
	 *
	 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
	 */
	this.render = function(ctx) {
		throw new Error("This object does not implement a 'render' function.");
	};
};

Behaviors.register("Renderable", behavior);
