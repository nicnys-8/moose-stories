/**
 * This behavior makes an object face the direction in which it is moving.
 */

"use strict";

//================================
// Private functions and variables
//================================

var Behaviors = require("./../behaviors");

//=================
// Public interface
//=================

var behavior = {};

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

console.log("iiiiiiiiiiiiiiiiiiiii");
console.log(behavior);
Behaviors.register("FaceDirection", behavior);
