/**
 * This behavior makes an object face the direction in which it is moving.
 */

"use strict";

var Behaviors = require("./../behaviors");

//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Moving"];

behavior.getProperties = function() {
    return {};
};

behavior.tick = function(gameState) {
    if (this.speed.x > 0) {
        this.scale.x = Math.abs(this.scale.x);
    } else if (this.speed.x < 0) {
        this.scale.x = -Math.abs(this.scale.x);
    }
};

Behaviors.register("FaceDirection", behavior);
