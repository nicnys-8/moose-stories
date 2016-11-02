/**
 * This behavior makes an object face the direction in which it is moving.
 */

"use strict";

const Behaviors = require("../../behaviors");

//=================
// Public interface
//=================

const behavior = {};

behavior.dependencies = ["Moving"];

/**
* Updates the state of the target object.
*/
behavior.tick = function() {
    if (this.acceleration.x < 0) {
        this.scale.x = Math.abs(this.scale.x);
    } else if (this.acceleration.x > 0) {
        this.scale.x = -Math.abs(this.scale.x);
    }
};

Behaviors.register("FaceDirection", behavior);
