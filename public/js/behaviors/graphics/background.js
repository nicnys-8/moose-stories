/**
 * Describes a background object.
 */

"use strict";

const Behaviors = require("../../behaviors");
const GameObject = require("../../game-object");

/**
 * Renders the object.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
 * @param {number} offsetX - Horizontal position of the center of the viewport.
 * @param {number} offsetY - Vertical position of the center of the viewport.
 */
function render(ctx, offsetX, offsetY) {
	this.layers.forEach((layer) => {
		layer.render(ctx, offsetX, offsetY);
	});
}


//=================
// Public interface
//=================

const behavior = {};

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.dependencies = ["Renderable", "HasIcon"];

behavior.getProperties = function() {
	return {
		layers: [],
		render: render
	};
};

Behaviors.register("Background", behavior);
