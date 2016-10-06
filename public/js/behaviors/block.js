/**
 * Describes the behavior of a playable platform character.
 */

"use strict";

var Behaviors = require("../behaviors"),
    GameObject = require("../game-object");


//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Solid", "HasAnimation"];

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
    return {
        boundingBox: {
            left: 0,
            right: 32,
            top: 0,
            bottom: 32
        }
    };
};

/**
 * Function that is called on an object when this behavior is added to it.
 */
behavior.init = function() {
    this.currentAnimation = new GameObject("Animation", {
        filePath: "img/sprites/block.svg",
        numFrames: 1
    });
};

Behaviors.register("Block", behavior);
