/**
 * Describes an object with a position, scale and rotation in 2D.
 */

"use strict";

const Behaviors = require("./../behaviors");
const behavior = {};

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function({position = {x: 0, y: 0}, scale = {x: 1, y: 1}, rotation = 0}) {

	this.position = position;
	this.scale    = scale;
	this.rotation = rotation;

};

Behaviors.register("Transform", behavior);
