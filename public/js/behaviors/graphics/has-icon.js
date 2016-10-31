/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

const Behaviors = require("../../behaviors");

/**
 * @param  {number} [size] - Preferred height and width of the icon.
 * @return {DOM Element} An icon representing the object.
 */
function getIcon(size) {
	const icon = document.createElement("i");
	icon.innerHTML = "&#9817";
	return icon;
}


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
		// Functions
		getIcon: getIcon
	};
};

Behaviors.register("HasIcon", behavior);
