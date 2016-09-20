"use strict";

/**
Describes an object that can be rendered on the screen
*/
module.exports = function() {

	//================================
	// Private functions and variables
	//================================

	/**
	 Render the object
	 @param ctx A 2D rendering context
	 */
	 function render(ctx) {
	 	if (this.currentSprite) {
	 		this.currentSprite.render(
	 			ctx,
	 			this.x,
	 			this.y,
	 			this.scale,
	 			this.rotation,
	 			this.alpha
	 		);
	 	}
	 };


	//=================
	// Public interface
	//=================

	var behavior = {};

	behavior.name = "Renderable";

	behavior.getProperties = function() {
		return {
			// Variables
			currentSprite: null,
			frame: 0,
			rotation: 0,
			scale: {x: 1, y: 1},
			alpha: 1,

			// Functions
			render: render
		}
	};

	behavior.tick = function(gameState) {
		if (this.currentSprite.imageSpeed > 0) {
			this.currentSprite.tick();
		}
	};

	return behavior;
}();
