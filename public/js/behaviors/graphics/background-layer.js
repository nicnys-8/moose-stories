/**
 * Describes a single layer of the background.
 */

"use strict";

const Behaviors = require("../../behaviors");
const GraphicsLoader = require("../../graphics-loader");

/**
 * Renders the background layer on screen.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
 * @param {number} offsetX - Horizontal position of the viewport's center.
 * @param {number} offsetY - Vertical position of the viewport.
 */
function render(ctx, offsetX, offsetY) {
	const width  = this.canvas.width;
	const height = this.canvas.height;
	const xTiles = (this.tiled.x) ? (Math.ceil(ctx.canvas.clientWidth / width) + 2) : 1;
	const yTiles = (this.tiled.y) ? (Math.ceil(ctx.canvas.clientHeight / height) + 2) : 1;

	let startX = this.position.x + (offsetX * this.parallax.x);
	let startY = this.position.y + (offsetY * this.parallax.y);

	if (this.tiled.x) {
		startX = -width + startX % width;
	}
	if (this.tiled.y) {
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
		parallax: {x: 1, y: 1},
		tiled: {x: false, y: false},

		/** @type {function} */
		render: render
	};
};

/**
 * Initialization function, called on an object when this behavior is added to it.
 *
 * @param {string} filePath - Path to the image file.
 */
behavior.init = function({filePath}) {
	if (typeof filePath !== "string") {
		throw new Error("'BackgroundLayer' behavior requires string argument '{filePath}'.");
	} else {
		this.canvas = GraphicsLoader.loadImage(filePath);
	}
};

Behaviors.register("BackgroundLayer", behavior);
