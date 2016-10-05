/**
 * Describes a camera object.
 */

"use strict";

var Behaviors = require("../../behaviors");


//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Transform"];

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
    return {
        // Variables
        sensitivity: 0.2,
        offset: {
            x: 0,
            y: -96
        },
        target: null
    };
};

/**
 * Updates the state of the target object.
 */
behavior.tick = function() {
    var xDistance = (this.target.position.x + this.offset.x) - this.position.x,
        yDistance = (this.target.position.y + this.offset.y) - this.position.y;

    this.position.x += xDistance * this.sensitivity;
    this.position.y += yDistance * this.sensitivity;
};


Behaviors.register("Camera", behavior);
