/**
 * Describes the behavior of a playable platform character.
 */

"use strict";

var Behaviors = require("../behaviors"),
    GameObject = require("../game-object"),
    boundingBox = {
        left: -16,
        right: 16,
        top: -48,
        bottom: 16
    },
    spriteOffset = {
        x: 16,
        y: 48
    },
    animations = {
        stand: null,
        walk: null,
        jump: null
    };


//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["FaceDirection", "Platform"];

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
    return {
        boundingBox: boundingBox
    };
};

/**
 * Updates the state of the target object.
 */
behavior.tick = function() {
    this.currentAnimation = (Math.abs(this.speed.x) > 0) ? animations.walk : animations.stand;
    if (!this.onGround) this.currentAnimation = animations.jump;
};

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function() {
    animations.stand = new GameObject("Animation", {
        filePath: "img/sprites/giri/stand.svg",
        numFrames: 1,
        origin: spriteOffset
    });
    animations.walk = new GameObject("Animation", {
        filePath: "img/sprites/giri/walk.svg",
        numFrames: 2,
        imageSpeed: 0.1,
        origin: spriteOffset
    });
    animations.jump = new GameObject("Animation", {
        filePath: "img/sprites/giri/jump.svg",
        numFrames: 1,
        origin: spriteOffset
    });
    this.currentAnimation = animations.jump;
};

Behaviors.register("Player", behavior);
