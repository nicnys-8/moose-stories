/**
 * Describes the default background object.
 */

"use strict";

const Behaviors = require("../../behaviors");
const GameObject = require("../../game-object");
const behavior = {};

behavior.dependencies = ["Background"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function() {
	
	const layerDescriptions = [{
		filePath: "img/backgrounds/sun.svg",
		position: {x: 600,   y: 50},
		parallax: {x: 0.1,   y: 0.02},
		tiled:    {x: false, y: false}
	}, {
		filePath: "img/backgrounds/rainbow.svg",
		position: {x: -250,  y: 200},
		parallax: {x: 0.4,   y: 0.04},
		tiled:    {x: false, y: false}
	}, {
		filePath: "img/backgrounds/mountains.svg",
		position: {x: 0,    y: 420},
		parallax: {x: 0.5,  y: 0.1},
		tiled:    {x: true, y: false}
	}, {
		filePath: "img/backgrounds/clouds.svg",
		position: {x: 0,    y: 100},
		parallax: {x: 0.6,  y: 0.12},
		tiled:    {x: true, y: false}
	}];

	this.layers = layerDescriptions.map(description => {
		return new GameObject("BackgroundLayer", description);
	});
};

Behaviors.register("DefaultBackground", behavior);
