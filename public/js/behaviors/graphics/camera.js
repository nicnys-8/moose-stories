/**
 * Describes a camera object.
 */

"use strict";

var Behaviors = require("../../behaviors");


//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = [];

/**
 * Returns the public variables and methods associated with this behavior.
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
    return {
        // Variables
        sensitivity: 0.2,
        x: 0,
        y: 0,
        scale: {
            x: 1,
            y: 1
        },
        offsetX: 0,
        offsetY: -96,
        rotation: 0,
        target: null
    };
};

/**
 * Updates the state of the target object.
 */
behavior.tick = function() {
    var xDistance = (this.target.x + this.offsetX) - this.x,
        yDistance = (this.target.y + this.offsetY) - this.y;

    this.x += xDistance * this.sensitivity;
    this.y += yDistance * this.sensitivity;
};


Behaviors.register("Camera", behavior);
