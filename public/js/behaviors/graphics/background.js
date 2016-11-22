/**
 * Describes a background object.
 */

"use strict";

const Behaviors = require("../../behaviors");
const GameObject = require("../../game-object");
const behavior = {};

behavior.dependencies = ["Renderable", "HasIcon"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function() {

	this.layers = [];

	/**
	 * Renders the background.
	 *
	 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
	 * @param {number} offsetX - Horizontal position of the center of the viewport.
	 * @param {number} offsetY - Vertical position of the center of the viewport.
	 */
	this.render = function(ctx, offsetX, offsetY) {
		this.layers.forEach((layer) => {
			layer.render(ctx, offsetX, offsetY);
		});
	};
};

Behaviors.register("Background", behavior);
