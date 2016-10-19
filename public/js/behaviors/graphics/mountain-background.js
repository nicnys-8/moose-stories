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
		filePath: "img/backgrounds/mountains.svg",
		x: 0,
		y: 360,
		tiledX: true,
		tiledY: false
	}];

	layerDescriptions.forEach(description => {
		let layer = new GameObject("BackgroundLayer", description);
		this.layers.push(layer);
	});
};

Behaviors.register("MountainBackground", behavior);
