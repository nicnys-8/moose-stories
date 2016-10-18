/**
 * Describes an object with a position, scale and rotation in 2D.
 */

"use strict";

const Behaviors = require("./../behaviors");


//=================
// Public interface
//=================

const behavior = {};

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
	return {
		position: {
			x: 0,
			y: 0
		},
		scale: {
			x: 1,
			y: 1
		},
		rotation: 0
	};
};

Behaviors.register("Transform", behavior);
