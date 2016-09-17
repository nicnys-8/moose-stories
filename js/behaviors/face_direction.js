/**
This behavior makes an object face the direction in which it is moving
 */
Behavior.FaceDirection = Behavior.FaceDirection || function() {

	//================================
	// Private functions and variables
	//================================
	

	//=================
	// Public interface
	//=================
	
	var behavior = {};
	
	behavior.name = "FaceDirection";

	behavior.getProperties = function() {
		return {};
	};
	
	behavior.tick = function(gameState) {
		if (this.hSpeed > 0) {
			this.scale.x = Math.abs(this.scale.x);
		} else if (this.hSpeed < 0) {
			this.scale.x = -Math.abs(this.scale.x);
		}
	};

	return behavior;
}();
