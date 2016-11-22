/**
 * This behavior makes an object face the direction in which it is moving.
 */

"use strict";

const Behaviors = require("../../behaviors");
const behavior = {};

behavior.dependencies = ["Moving"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function() {

    /**
	 * Add function for updating the object.
	 */
	this.onUpdate((gameState, windowWidth = 0, windowHeight = 0) => {
        if (this.acceleration.x < 0) {
            this.scale.x = Math.abs(this.scale.x);
        } else if (this.acceleration.x > 0) {
            this.scale.x = -Math.abs(this.scale.x);
        }
    });

};

Behaviors.register("FaceDirection", behavior);
