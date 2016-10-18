/**
 * Describes an animated object.
 */

"use strict";

const Behaviors = require("../../behaviors");

/**
 * Renders the sprite on screen.
 *
 * @param {CanvasRenderingContext2D} ctx 2D rendering context.
 * @param {number} position.x - The horizontal position on the context where the sprite will be rendered.
 * @param {number} position.y - The vertical position on the context where the sprite will be rendered.
 * @param {number} scale.x    - Horizontal scale of the sprite.
 * @param {number} scale.y    - Vertical scale of the sprite.
 * @param {number} rotation   - The sprite's rotation in radians.
 * @param {number} alpha      - Opacity of the object, a value between 0 and 1.
 */
function render(ctx, position, scale, rotation, alpha) {
	const width = this.canvas.width / this.numFrames,
		height = this.canvas.height,
		clippingX = Math.round(this.currentFrame) * width,
		clippingY = 0,
		canvasX = this.position.x - this.origin.x,
		canvasY = this.position.y - this.origin.y;

	ctx.save();

	ctx.translate(position.x, position.y);
	if (scale.x !== 1 || scale.y !== 1) {
		ctx.scale(scale.x, scale.y);
	}
	if (rotation !== 0) {
		ctx.rotate(rotation);
	}
	if (ctx.globalAlpha !== 1) {
		ctx.globalAlpha = alpha;
	}
	ctx.drawImage(
		this.canvas,
		clippingX, clippingY,
		width, height, // Clipping size
		canvasX, canvasY,
		width, height // Size on screen
	);

	ctx.restore();
}


//=================
// Public interface
//=================

const behavior = {};

behavior.dependencies = ["Renderable", "LoadImage"];

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
	return {
		// Variables
		canvas: null,
		numFrames: 1,
		origin: null,
		currentFrame: 0,
		imageSpeed: 0,

		// Functions
		render: render
	};
};

/**
 * Initialization function, called on an object when this behavior is added to it.
 *
 * @param {string} args.filePath - Path to the image file.
 */
behavior.init = function(args) {
	if (args && args.filePath) {
		this.canvas = this.loadImage(args.filePath);
		if (this.origin === null) {
			this.origin = {
				x: (this.canvas.width / this.numFrames) / 2,
				y: this.canvas.height / 2
			};
		}
	} else {
		throw new Error("'Animation' behavior requires argument 'filePath'.");
	}
};

/**
 * Updates the state of the target object.
 */
behavior.tick = function() {
	this.currentFrame = (this.currentFrame + this.imageSpeed) % (this.numFrames - 1);
};

Behaviors.register("Animation", behavior);
