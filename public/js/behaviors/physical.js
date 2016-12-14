/**
 * Describes the behavior of a physical object.
 */

"use strict";

//=========================
// Private static variables
//=========================

const Behaviors = require("./../behaviors");
const config    = require("./../config");
const behavior  = {};

/**
 * @return {number} Y-coordinate of the uppermost point of the object.
 */
function getTop() {
	return this.position.y + this.boundingBox.top;
}

/**
 * @return {number} Y-coordinate of the lowest point of the object.
 */
function getBottom() {
	return this.position.y + this.boundingBox.bottom;
}

/**
 * @return {number} X-coordinate of the leftmost point of the object.
 */
function getLeft() {
	return this.position.x + this.boundingBox.left;
}

/**
 * @return {number} X-coordinate of the rightmost point of the object.
 */
function getRight() {
	return this.position.x + this.boundingBox.right;
}

/**
 * @return {number} Height of the object.
 */
function getHeight() {
	return this.getBottom() - this.getTop();
}

/**
 * @return {number} Width of the object.
 */
function getWidth() {
	return this.getRight() - this.getLeft();
}

/**
 * @return {object} The area currently occupied by the game object.
 */
function getArea() {
	return {
		top:    this.getTop(),
		bottom: this.getBottom(),
		left:   this.getLeft(),
		right:  this.getRight()
	};
}

/**
 * Returns an object on the form {top, bottom, left, right}, where each property
 * specifies how many pixel rows/columns of the specified area are covered by
 * this object.
 *
 * @param  {object} area - The area to check for overlaps.
 * @return {Object} Object describing current overlaps.
 */
function getOverlap(area) {

	const thisTop    = this.getTop();
	const thisBottom = this.getBottom();
	const thisLeft   = this.getLeft();
	const thisRight  = this.getRight();

	const overlap = {
		top:    0,
		bottom: 0,
		left:   0,
		right:  0
	};

	// Check if there are no overlaps.
	if (
		thisTop    >= area.bottom ||
		thisBottom <= area.top    ||
		thisLeft   >= area.right  ||
		thisRight  <= area.left
		) {
		return overlap;
	}

	// Calculate the overlaps.
	if (area.top > thisTop) {
		overlap.top = thisBottom - area.top;
	}
	if (area.bottom < thisBottom) {
		overlap.bottom = area.bottom - thisTop;
	}
	if (area.left > thisLeft) {
		overlap.left = thisRight - area.left;
	}
	if (area.right < thisRight) {
		overlap.right = area.right - thisLeft;
	}

	return overlap;
}


/**
 * @return {boolean} True if the object is standing on the other one.
 */
function onTopOf(obj) {
	return (!(this.getLeft() >= obj.getRight() || this.getRight() <= obj.getLeft()) && this.getBottom() === obj.getTop());
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
		left:  -config.tileSize / 2,
		right:  config.tileSize / 2,
		top:   -config.tileSize / 2,
		bottom: config.tileSize / 2
	};

	//this.onGround    = true; // TODO: Replace with setter/getter?
	//this.wasOnGround = true; // TODO: Replace with setter/getter?

	/** @type {function} */
	this.getTop     = getTop;
	this.getBottom  = getBottom;
	this.getLeft    = getLeft;
	this.getRight   = getRight;
	this.getWidth   = getWidth;
	this.getHeight  = getHeight;
	this.getArea    = getArea;
	this.getOverlap = getOverlap;
	//this.onTopOf    = onTopOf;

	/**
	 * Add function for updating the object.
	 *
	 * @param {GameState} gameState - Object defining the game's current state.
	 
	this.onUpdate((gameState) => {
		const solids = gameState.filter("Solid");

		this.wasOnGround = this.onGround;
		this.onGround = false;

		solids.forEach(solid => {
			if (this.onTopOf(solid)) {
				this.onGround = true;
			}
		});
	});*/

};

Behaviors.register("Physical", behavior);
