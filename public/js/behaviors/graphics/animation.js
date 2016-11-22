/**
 * Describes an animated object.
 */

"use strict";

const Behaviors = require("../../behaviors");
const GraphicsLoader = require("../../graphics-loader");
const behavior = {};

behavior.dependencies = ["Renderable"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 *
 * @param {string} filePath      - Path to the image file.
 * @param {number} origin.x      - Horizontal offset at which the image is drawn.
 * @param {number} origin.y      - Vertical offset at which the image is drawn.
 * @param {number} currentFrame  - Initial frame of the animation.
 * @param {string} numFrames     - Number of animation frames.
 * @param {string} imageSpeed    - Animation speed in frames per game tick.
 */
behavior.init = function({filePath, origin, currentFrame = 0, numFrames = 1, imageSpeed = 0}) {

	if (typeof filePath !== "string") {
		throw new Error("'Animation' behavior requires string argument '{filePath}'.");
	}
	this.canvas = GraphicsLoader.loadImage(filePath);
	if (typeof origin === "undefined") {
		origin = {
			x: (this.canvas.width / numFrames) / 2,
			y: this.canvas.height / 2
		};
	}

	/**
	 * Renders the sprite on screen.
	 *
	 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
	 * @param {number} position.x - The horizontal position on the context where the sprite will be rendered.
	 * @param {number} position.y - The vertical position on the context where the sprite will be rendered.
	 * @param {number} scale.x    - Horizontal scale of the sprite.
	 * @param {number} scale.y    - Vertical scale of the sprite.
	 * @param {number} rotation   - The sprite's rotation in radians.
	 * @param {number} alpha      - Opacity of the object, a value between 0 and 1.
	 */
	this.render = function(ctx, position, scale, rotation, alpha) {

		const width     = this.canvas.width / numFrames;
		const height    = this.canvas.height;
		const clippingX = Math.round(currentFrame) * width;
		const clippingY = 0;
		const canvasX   = this.position.x - origin.x;
		const canvasY   = this.position.y - origin.y;

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
	};

	/**
	 * Add function for updating the object.
	 */
	this.onUpdate(() => {
		if (imageSpeed !== 0) {
			currentFrame = (currentFrame + imageSpeed) % (numFrames - 1);
		}
	});
};

Behaviors.register("Animation", behavior);
