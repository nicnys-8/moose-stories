/**
A solid block object
 */
ObjectFactory.Elevator = function(params) {

	GameObject.call(this, params);

	
	//================================
	// Private functions and variables
	//================================
	var width = 16;
	var height = 16;

	var hotspot = {x: width / 2, y: height / 2};

	var lowerLimit = 128;
	var upperLimit = 16;
	

	//==============
	// Add behaviors
	//==============
	
	this.addBehavior(Behavior.Renderable);
	this.addBehavior(Behavior.Physical);
	this.addBehavior(Behavior.Solid);
	this.addBehavior(Behavior.Moving);


	//=================
	// Public interface
	//=================

	this.currentSprite = SpriteFactory.createSprite("img/sprites/block.png", 1, hotspot);
	this.boundingBox = {
		left: -width / 2, right: width / 2,
		top: -height / 2, bottom: height/ 2
	};

	this.vAcceleration = 0;
	this.on = false;

	/**
	Overwriting the tick object
	*/
	this.tick = function(gameState) {

		if (this.on) {
			this.vSpeed = -1;
			if (this.y >= lowerLimit) {
				this.vSpeed = -1;

			} else if (this.y <= upperLimit) {
				this.vSpeed = 1;
			}	
		}

		for (var i = 0; i < this.ticks.length; i++) {
			this.ticks[i].call(this, gameState);
		}
	};
}

ObjectFactory.Elevator.prototype = new GameObject();

