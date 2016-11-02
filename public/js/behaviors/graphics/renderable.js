/**
 * Describes an object that can be rendered on the screen.
 */

"use strict";

const Behaviors = require("../../behaviors");

/**
 * Renders the object.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
 */
function render(ctx) {
	throw new Error("This object does not implement a 'render' function.");
}


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
		alpha: 1,

		/** @type {function} */
		render: render
	};
};

Behaviors.register("Renderable", behavior);
