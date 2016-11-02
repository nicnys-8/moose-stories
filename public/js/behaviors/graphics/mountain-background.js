/**
 * Describes a background object.
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
		position: {x: 0, y: 260},
		parallax: {x: 0.5, y: 0.5},
		tiled: {x: true, y: false}
	}];

	this.layers = layerDescriptions.map(description => {
		return new GameObject("BackgroundLayer", description);
	});
};

Behaviors.register("MountainBackground", behavior);
