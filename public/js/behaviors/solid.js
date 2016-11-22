/**
 * Describes the behavior of a solid object -
 * The object solidity can be turned on or off
 * with the function setSolid
 */

"use strict";

const Behaviors = require("../behaviors");
const behavior = {};

behavior.dependencies = ["Physical"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function() {

	let solid = true;

	/**
	 * @returns {boolean} Whether or not the object is currently solid.
	 */
	this.isSolid = function() {
		return solid;
	};

	/**
	 * Sets the solidity of the object
	 *
	 * @param {boolean} value - True if it should be solid, false otherwise.
	 */
	this.setSolid = function(value) {
		solid = value;
	};

};

Behaviors.register("Solid", behavior);
