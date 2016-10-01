/**
 * Describes the behavior of a playable platform character.
 */

"use strict";

var Behaviors = require("../behaviors"),
    GameObject = require("../objects/game-object"),
    hotspot = {
        x: 16,
        y: 32
    },
    boundingBox = {
        left: -16,
        right: 16,
        top: -32,
        bottom: 32
    };

//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Solid", "Animated"];

/**
* Returns the public variables and methods associated with this behavior.
* @return {object} An object containing behavior variables and methods.
*/
behavior.getProperties = function() {
    return {
        // Variables
        boundingBox: boundingBox,
        hotspot: hotspot
    };
};

/**
* Function that is called on an object when this behavior is added to it.
*/
behavior.init = function() {
    this.currentAnimation = new GameObject("Animation", {
        imgPath: "img/sprites/block.svg",
        numFrames: 1,
        hotspot: hotspot
    });
};

Behaviors.register("Block", behavior);
