/**
 * Describes an animated object.
 */

"use strict";

const Behaviors = require("../../behaviors");

/**
 * Renders the background layer on screen.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
 * @param {number} offsetX - Horizontal position of the center of the viewport.
 * @param {number} offsetY - Vertical position of the center of the viewport.
 */
function render(ctx, offsetX, offsetY) {
	const width = this.canvas.width;
	const height = this.canvas.height;
	const startX = (this.tiledX) ? (-width + this.position.x) : this.position.x;
	const startY = (this.tiledY) ? (-height + this.position.y) : this.position.y;
	const xTiles = (this.tiledX) ? (Math.ceil(ctx.canvas.clientWidth / width) + 1) : 1;
	const yTiles = (this.tiledY) ? (Math.ceil(ctx.canvas.clientHeight / height) + 1) : 1;

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
	ctx.translate(
		startX + offsetX * this.parallax.x,
		startY + offsetY * this.parallax.y
	);

	for (let i = 0; i < xTiles; i++) {
		for (let j = 0; j < yTiles; j++) {
			ctx.drawImage(
				this.canvas,
				0, 0,
				width, height,
				i * width, j * height,
				width, height
			);
		}
	}
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
		tiledX: false,
		tiledY: false,
		parallax: {
			x: 1,
			y: 1
		},
		
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
	} else {
		throw new Error("'BackgroundLayer' behavior requires argument 'filePath'.");
	}
};

Behaviors.register("BackgroundLayer", behavior);
