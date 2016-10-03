/**
 * Describes the behavior of a playable platform character.
 */

"use strict";

var Behaviors = require("../behaviors"),
    GameObject = require("../game-object"),
    hotspot = {
        x: 16,
        y: 32
    },
    boundingBox = {
        left: -16,
        right: 16,
        top: -32,
        bottom: 32
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
* Returns the public variables and methods associated with this behavior.
* @return {object} An object containing behavior variables and methods.
*/
behavior.getProperties = function() {
  return {
    hotspot: hotspot,
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
      imagePath: "img/sprites/giri/stand.svg",
      numFrames: 1,
      hotspot: hotspot
  });
  animations.walk = new GameObject("Animation", {
      imagePath: "img/sprites/giri/walk.svg",
      numFrames: 2,
      hotspot: hotspot,
      imageSpeed: 0.1
  });
  animations.jump = new GameObject("Animation", {
      imagePath: "img/sprites/giri/jump.svg",
      numFrames: 1,
      hotspot: hotspot
  });
  this.currentAnimation = animations.jump;
};

Behaviors.register("Player", behavior);
