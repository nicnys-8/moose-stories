/**
 * Constructor of a camera object.
 */

 "use strict";

function Camera() {

	var sensitivity = 0.2;


	//=================
	// Public variables
	//=================

	this.x = 0;
	this.y = 0;

	this.scale = {x: 1, y: 1};

	this.offsetX = 0;
	this.offsetY = -96;
    this.rotation = 0;

	this.target = null;


	//=================
	// Public functions
	//=================

	this.tick = function() {
		var xDistance = (this.target.x + this.offsetX) - this.x,
			yDistance = (this.target.y + this.offsetY) - this.y;

		this.x += xDistance * sensitivity;
		this.y += yDistance * sensitivity;
	};

}

module.exports = new Camera();
