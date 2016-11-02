/**
 * Describes the behavior of a playable platform character.
 */

"use strict";

const Behaviors = require("../behaviors");
const GameObject = require("../game-object");

const boundingBox = {
	left: -16,
	right: 16,
	top: -48,
	bottom: 16
};
const spriteOffset = {
	x: 16,
	y: 48
};


//=================
// Public interface
//=================

const behavior = {};

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
	this.currentAnimation = (Math.abs(this.speed.x) > 0) ?
		this.animations.walk :
		this.animations.stand;
	if (!this.onGround) this.currentAnimation = this.animations.jump;
};

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function() {
	this.animations.stand = new GameObject("Animation", {
		filePath: "img/sprites/giri/stand.svg",
		numFrames: 1,
		origin: spriteOffset
	});
	this.animations.walk = new GameObject("Animation", {
		filePath: "img/sprites/giri/walk.svg",
		numFrames: 2,
		imageSpeed: 0.1,
		origin: spriteOffset
	});
	this.animations.jump = new GameObject("Animation", {
		filePath: "img/sprites/giri/jump.svg",
		numFrames: 1,
		origin: spriteOffset
	});
	this.currentAnimation = this.animations.jump;
};

Behaviors.register("Player", behavior);
