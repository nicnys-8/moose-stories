"use strict";

/**
Describes the behavior of a solid object -
The object solidity can be turned on or off
with the function setSolid
 */
module.exports = function() {

	//================================
	// Private functions and variables
	//================================

	var wasMoved = false,
		standardAcceleration = 0.5;

	function moveLeft() {
		wasMoved = true;
		this.hAcceleration = -standardAcceleration;
	}

	function moveRight() {
		wasMoved = true;
		this.hAcceleration = standardAcceleration;
	}


	//=================
	// Public interface
	//=================

	var behavior = {};

	behavior.name = "Controllable";

	behavior.requires = ["Platform"]; //TODO: Implement?

	behavior.getProperties = function() {
		return {
			// Variables
			isControllable: true,

			// Functions
			moveLeft: moveLeft,
			moveRight: moveRight
		};
	};

	behavior.tick = function(gameState) {
		if (!wasMoved) {
			this.hAcceleration = -this.hSpeed / 5;
		}
		wasMoved = false;
	};

	return behavior;
}();
