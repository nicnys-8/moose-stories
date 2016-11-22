/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

const Behaviors = require("../../behaviors");
const behavior = {};

/**
 * Initialization function, called on an object when this behavior is added to it.
 *
 * @param {string} args.name Name of the song or sound effect.
 */
behavior.init = function(args) {

	/**
	 * @param  {number} [size] - Preferred height and width of the icon.
	 * @return {DOM Element} An icon representing the object.
	 */
	this.getIcon = function(size) {
		const icon = document.createElement("i");
		icon.innerHTML = "&#9817";
		return icon;
	};
	
};

Behaviors.register("HasIcon", behavior);
