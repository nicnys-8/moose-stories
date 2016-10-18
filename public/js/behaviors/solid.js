/**
 * Describes the behavior of a solid object -
 * The object solidity can be turned on or off
 * with the function setSolid
 */

"use strict";

const Behaviors = require("../behaviors");
let currentlySolid = true;

/**
 * @returns {boolean} Whether or not the object is currently solid
 */
function isSolid() {
	return currentlySolid;
}

/**
 * Sets the solidity of the object
 *
 * @param {boolean} bool - True if it should be solid, false otherwise.
 */
function setSolid(solid) {
	currentlySolid = solid;
}

//=================
// Public interface
//=================

const behavior = {};

behavior.dependencies = ["Physical"];

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
	return {
		isSolid: isSolid,
	};
};

Behaviors.register("Solid", behavior);
