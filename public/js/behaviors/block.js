/**
 * Describes the behavior of a playable platform character.
 */

"use strict";

const Behaviors = require("../behaviors"),
	GameObject = require("../game-object");


//=================
// Public interface
//=================

const behavior = {};

behavior.dependencies = ["Solid", "HasAnimation"];

/**
 * Function that is called on an object when this behavior is added to it.
 */
behavior.init = function() {
	this.currentAnimation = new GameObject("Animation", {
		filePath: "img/sprites/block.svg",
		numFrames: 1
	});
};

Behaviors.register("Block", behavior);
