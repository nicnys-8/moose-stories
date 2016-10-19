/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

const Behaviors = require("../../behaviors");
const GameObject = require("../../game-object");


//=================
// Public interface
//=================

const behavior = {};

behavior.dependencies = ["Background"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function(args) {
	const layerDescriptions = [{
		filePath: "img/backgrounds/sun.svg",
		position: {
			x: 400,
			y: 100
		},
		parallax: {
			x: 0.3,
			y: 0.3
		},
		tiledX: false,
		tiledY: false
	}, {
		filePath: "img/backgrounds/rainbow.svg",
		position: {
			x: -250,
			y: 160
		},
		parallax: {
			x: 0.4,
			y: 0.4
		},
		tiledX: false,
		tiledY: false
	}, {
		filePath: "img/backgrounds/mountains.svg",
		position: {
			x: 0,
			y: 260
		},
		parallax: {
			x: 0.5,
			y: 0.5
		},
		tiledX: true,
		tiledY: false
	}, {
		filePath: "img/backgrounds/clouds.svg",
		position: {
			x: 0,
			y: -50
		},
		parallax: {
			x: 0.6,
			y: 0.6
		},
		tiledX: true,
		tiledY: false
	}];

	layerDescriptions.forEach(description => {
		const layer = new GameObject("BackgroundLayer", description);
		this.layers.push(layer);
	});
};

Behaviors.register("DefaultBackground", behavior);
