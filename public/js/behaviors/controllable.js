"use strict";

/**
Describes the behavior of a solid object -
The object solidity can be turned on or off
with the function setSolid
 */
module.exports = function() {

	//=================
	// Public interface
	//=================

	var behavior = {};

	behavior.name = "Controllable";

	behavior.getProperties = function() {
		return {
			isControllable: true
		};
	};

	return behavior;
}();
