/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

const Behaviors = require("../../behaviors");
const behavior = {};

behavior.dependencies = ["Renderable", "HasIcon"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function() {

	/**
	* The animation that is shown at any given moment.
	* @type {GameObject}
	*/
	this.currentAnimation = null;

	/**
	 * Renders the object.
	 *
	 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
	 */
	this.render = function(ctx) {
		if (this.currentAnimation) {
			this.currentAnimation.render(ctx, this.position, this.scale, this.rotation, this.alpha);
		}
	};

	/**
	 * @param  {number} [size] - Preferred height and width of the icon.
	 * @return {DOM Element} An icon representing the object.
	 */
	this.getIcon = function(size = 32) {
		const srcCanvas = this.currentAnimation.canvas;
		const icon = document.createElement("canvas");

		icon.width = srcCanvas.width;
		icon.height = srcCanvas.height;
		icon.getContext("2d").drawImage(srcCanvas, 0, 0);

		return icon;
	};

	/**
	 * Add function for updating the object.
	 */
	this.onUpdate(() => {
		if (this.currentAnimation) {
			this.currentAnimation.tick();
		}
	});

};

Behaviors.register("HasAnimation", behavior);
