/**
Behavior describing a platform character
 */
Behavior.Platform = Behavior.Platform || function() {

	//================================
	// Private functions and variables
	//================================

	var jumpSound = AudioFactory.createSound("audio/jump.wav"),
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
