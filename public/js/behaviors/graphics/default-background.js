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

	const layerArgumentList = [{
			BackgroundLayer: {
				filePath: "img/backgrounds/sun.svg",
				parallax: {x: 0.1, y: 0.02},
				tiled:    {x: false, y: false}
			},
			Transform: {
				position: {x: 600, y: 50}
			}
		},
		{
			BackgroundLayer: {
				filePath: "img/backgrounds/rainbow.svg",
				parallax: {x: 0.4, y: 0.04},
				tiled:    {x: false, y: false}
			},
			Transform: {
			position: {x: -250, y: 200}
			}
		},
		{
			BackgroundLayer: {
				filePath: "img/backgrounds/mountains.svg",
				parallax: {x: 0.5, y: 0.1},
				tiled:    {x: true, y: false}
			},
			Transform: {
				position: {x: 0, y: 420},
			}
		},
		{
			BackgroundLayer: {
				filePath: "img/backgrounds/clouds.svg",
				parallax: {x: 0.6, y: 0.12},
				tiled:    {x: true, y: false}
			},
			Transform: {
				position: {x: 0, y: 100}
			}
		}
	];

	this.layers = layerArgumentList.map(arg => {
		return new GameObject(arg);
	});
};

Behaviors.register("DefaultBackground", behavior);
