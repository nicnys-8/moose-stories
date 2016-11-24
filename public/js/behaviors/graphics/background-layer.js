/**
 * Describes a single layer of the background.
 */

"use strict";

const Behaviors = require("../../behaviors");
const GraphicsLoader = require("../../graphics-loader");
const behavior = {};

behavior.dependencies = ["Renderable"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 *
 * @param {string}  filePath   - Path to the image file.
 * @param {number}  parallax.x - Horizontal parallax (value between 0 and 1)
 * @param {number}  parallax.y - Vertical parallax (value between 0 and 1)
 * @param {boolean} tiled.x    - Specifies if the image should be tiled horizontally.
 * @param {boolean} tiled.y    - Specifies if the image should be tiled vertically.
 */
behavior.init = function({filePath, parallax = {x: 1, y: 1}, tiled = {x: false, y: false}}) {

	if (typeof filePath !== "string") {
		throw new Error("'BackgroundLayer' behavior requires string argument '{filePath}'.");
	} else {
		this.canvas = GraphicsLoader.loadImage(filePath);
	}

	/**
	 * Renders the background layer on screen.
	 *
	 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
	 * @param {number} offsetX - Horizontal position of the viewport's center.
	 * @param {number} offsetY - Vertical position of the viewport.
	 */
	this.render = function(ctx, offsetX, offsetY) {
		const width  = this.canvas.width;
		const height = this.canvas.height;
		const xTiles = (tiled.x) ? (Math.ceil(ctx.canvas.clientWidth / width) + 2) : 1;
		const yTiles = (tiled.y) ? (Math.ceil(ctx.canvas.clientHeight / height) + 2) : 1;

		let startX = this.position.x + (offsetX * parallax.x);
		let startY = this.position.y + (offsetY * parallax.y);
		
		if (tiled.x) {
			startX = -width + startX % width;
		}
		if (tiled.y) {
			startY = -height + startY % height;
		}

		ctx.save();
		if (this.scale.x !== 1 || this.scale.y !== 1) {
			ctx.scale(this.scale.x, this.scale.y);
		}
		if (this.rotation !== 0) {
			ctx.rotate(this.rotation);
		}
		if (this.alpha === 1) {
			ctx.globalAlpha = this.alpha;
		}
		ctx.translate(startX, startY);

		for (let i = 0; i < xTiles; i++) {
			for (let j = 0; j < yTiles; j++) {
				ctx.drawImage(this.canvas, 0, 0, width, height, i * width, j * height, width, height);
			}
		}
		ctx.restore();
	};
};

Behaviors.register("BackgroundLayer", behavior);
