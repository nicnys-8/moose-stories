/**
 * Describes an object with a position, scale and rotation in 2D.
 */

"use strict";

const Behaviors = require("./../behaviors");
const behavior = {};

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function() {

	this.position = {x: 0, y: 0};
	this.scale    = {x: 1, y: 1};
	this.rotation = 0;

};

Behaviors.register("Transform", behavior);
