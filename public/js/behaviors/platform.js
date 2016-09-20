"use strict";

/**
Behavior describing a platform character
 */
module.exports = function() {

	//================================
	// Private functions and variables
	//================================

	var AudioFactory = require("./../audio-factory"),
		jumpSound = AudioFactory.createSound("audio/jump.wav"),
		landSound = AudioFactory.createSound("audio/land.wav");

	function jump() {
		this.vSpeed = -5;
		jumpSound.play();
	}


	//=================
	// Public interface
	//=================

	var behavior = {};

	behavior.name = "Platform";

	behavior.getProperties = function() {
		return {
			jump: jump
		};
	};

	behavior.tick = function(gameState) {
		if (this.onGround && !this.wasOnGround) {
			landSound.play();
		}
	};

	return behavior;
}();
