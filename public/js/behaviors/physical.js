/**
 * Describes the behavior of a physical object.
 */

"use strict";

//=========================
// Private static variables
//=========================

const Behaviors = require("./../behaviors");
const config = require("./../config");
const behavior = {};


//=================
// Static functions
//=================

/**
 * Check whether this object overlaps another.
 *
 * @param {GameObject} obj - The object to check for overlap with
 * @return {boolean} True if an overlap was detected, false otherwise
 */
function overlapsObject(obj) {
	return this.overlapsAtOffset(obj, 0, 0);
}

/**
 * Check whether this object would overlap another if it were moved by the specified offset.
 *
 * @param {GameObject} obj - The object to check for overlap with
 * @param {number} offsetX - The horizontal distance to check
 * @param {number} offsetY - The vertical distance to check
 * @return {boolean} True if an overlap was detected, false otherwise
 */
function overlapsAtOffset(obj, offsetX, offsetY) {
	return !(
		this.position.x + offsetX + this.boundingBox.left >= obj.position.x + obj.boundingBox.right ||
		this.position.x + offsetX + this.boundingBox.right <= obj.position.x + obj.boundingBox.left ||
		this.position.y + offsetY + this.boundingBox.top >= obj.position.y + obj.boundingBox.bottom ||
		this.position.y + offsetY + this.boundingBox.bottom <= obj.position.y + obj.boundingBox.top
	);
}

/**
 * Check whether this object overlaps a point.
 *
 * @param {number} x - Horizontal position of point,
 * @param {number} y - Vertical position of point,
 * @return {boolean} True if an overlap was detected, false otherwise,
 */
function overlapsPoint(x, y) {
	return !(
		this.position.x + this.boundingBox.left >= x ||
		this.position.x + this.boundingBox.right <= x ||
		this.position.y + this.boundingBox.top >= y ||
		this.position.y + this.boundingBox.bottom <= y
	);
}

/**
 * Check by how much this objects overlaps another along a specified coordinate.
 *
 * @param {GameObject} obj - The object to check for collisions with.
 * @param {string} coordinate - The coordinate along which to check, either "x" or "y".
 * @return {number} The amount of overlap.
 */
function overlapsBy(obj, coordinate) {
	let boundingBoxVar1 = null;
	let boundingBoxVar2 = null;

	switch (coordinate) {
		case "x":
			boundingBoxVar1 = "left";
			boundingBoxVar2 = "right";
			break;
		case "y":
			boundingBoxVar1 = "top";
			boundingBoxVar2 = "bottom";
			break;
		default:
			throw new Error("Not a valid coordinate.");
	}
	if (this.position[coordinate] < obj.position[coordinate]) {
		return this.position[coordinate] + this.boundingBox[boundingBoxVar2] - (obj.position[coordinate] + obj.boundingBox[boundingBoxVar1]);
	} else {
		return this.position[coordinate] + this.boundingBox[boundingBoxVar1] - (obj.position[coordinate] + obj.boundingBox[boundingBoxVar2]);
	}
}

//@TODO: horizontalOverlap and verticalOverlap are deprecated. Use overlapsby instead. Remove all uses of the deprecated functions.

function horizontalOverlap(obj) {
	console.warn("Deprecated function");
	if (this.position.x < obj.position.x) {
		return (this.position.x + this.boundingBox.right) - (obj.position.x + obj.boundingBox.left);
	} else {
		return (this.position.x + this.boundingBox.left) - (obj.position.x + obj.boundingBox.right);
	}
}

/**
 * @param  {GameState} gameState - Object defining the game's current state.
 * @return {boolean}   True if the object is outside the level bounds.

function isOutsideLevel(gameState) {
	return (this.position.x < 0 ||
		this.position.y < 0 ||
		this.position.x > gameState.getWidth() ||
		this.position.y > gameState.getHeight());
}*/

function verticalOverlap(obj) {
	console.warn("Deprecated function");
	if (this.position.y < obj.position.y) {
		return (this.position.y + this.boundingBox.bottom) - (obj.position.y + obj.boundingBox.top);
	} else {
		return (this.position.y + this.boundingBox.top) - (obj.position.y + obj.boundingBox.bottom);
	}
}

/**
 * @return {boolean} True if the object is standing on the other one.
 */
function onTopOf(obj) {
	return (!(this.position.x + this.boundingBox.left >= obj.position.x + obj.boundingBox.right ||
			this.position.x + this.boundingBox.right <= obj.position.x + obj.boundingBox.left) &&
		this.position.y + this.boundingBox.bottom === obj.position.y + obj.boundingBox.top
	);
}


//====================
// Define the behavior
//====================

behavior.dependencies = ["Transform"];

/**
 * Function that is called on an object when this behavior is added to it.
 */
behavior.init = function() {

	this.weight = 32;
	this.boundingBox = {
		left: -config.tileSize / 2,
		right: config.tileSize / 2,
		top: -config.tileSize / 2,
		bottom: config.tileSize / 2
	};

	this.onGround = true; // TODO: Replace with setter/getter
	this.wasOnGround = true; // TODO: Replace with setter/getter

	/** @type {function} */
	this.overlapsObject = overlapsObject;
	this.overlapsAtOffset = overlapsAtOffset;
	this.overlapsPoint = overlapsPoint;
	this.overlapsBy = overlapsBy;
	this.horizontalOverlap = horizontalOverlap;
	this.verticalOverlap = verticalOverlap;
	this.onTopOf = onTopOf;

	/**
	 * Add function for updating the object.
	 *
	 * @param {GameState} gameState - Object defining the game's current state.
	 */
	this.onUpdate((gameState) => {
		const solids = gameState.filter("Solid");

		this.wasOnGround = this.onGround;
		this.onGround = false;

		solids.forEach(solid => {
			if (this.onTopOf(solid)) {
				this.onGround = true;
			}
		});
	});

};

Behaviors.register("Physical", behavior);
