/**
 * Describes the behavior of a physical object.
 */

"use strict";

var GameState = require("./../game-state"),
    Behaviors = require("./../behaviors");
// @TODO: Rename functions to specifiy whether they work with objects or other things. e.g. overlapsObjectOffset ??? (note: this is a question)


/**
 * Check whether this object overlaps another.
 *
 * @param {GameObject} obj The object to check for overlap with
 * @return {boolean} True if an overlap was detected, false otherwise
 */
function overlapsObject(obj) {
    return this.overlapsAtOffset(obj, 0, 0);
}

/**
 * Check whether this object would overlap another if it were moved by the specified offset.
 *
 * @param {GameObject} obj The object to check for overlap with
 * @param {number} offsetX The horizontal distance to check
 * @param {number} offsetY The vertical distance to check
 * @return {boolean} True if an overlap was detected, false otherwise
 */
function overlapsAtOffset(obj, offsetX, offsetY) {
    return !(
        this.x + offsetX + this.boundingBox.left >= obj.x + obj.boundingBox.right ||
        this.x + offsetX + this.boundingBox.right <= obj.x + obj.boundingBox.left ||
        this.y + offsetY + this.boundingBox.top >= obj.y + obj.boundingBox.bottom ||
        this.y + offsetY + this.boundingBox.bottom <= obj.y + obj.boundingBox.top
    );
}

/**
 * Check whether this object overlaps a point.
 *
 * @param {number} x Horizontal position of point,
 * @param {number} y Vertical position of point,
 * @return {boolean} True if an overlap was detected, false otherwise,
 */
function overlapsPoint(x, y) {
    return !(
        this.x + this.boundingBox.left >= x ||
        this.x + this.boundingBox.right <= x ||
        this.y + this.boundingBox.top >= y ||
        this.y + this.boundingBox.bottom <= y
    );
}

/**
 * Check by how much this objects overlaps another along a specified coordinate.
 *
 * @param {GameObject} obj The object to check for collisions with.
 * @param {string} coordinate The coordinate along which to check, either "x" or "y".
 * @return {number} The amount of overlap.
 */
function overlapsBy(obj, coordinate) {
    var boundingBoxVar1,
        boundingBoxVar2;

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
    if (this[coordinate] < obj[coordinate]) {
        return this[coordinate] + this.boundingBox[boundingBoxVar2] - (obj[coordinate] + obj.boundingBox[boundingBoxVar1]);
    } else {
        return this[coordinate] + this.boundingBox[boundingBoxVar1] - (obj[coordinate] + obj.boundingBox[boundingBoxVar2]);
    }
}

//@TODO: horizontalOverlap and verticalOverlap are deprecated. Use overlapsby instead. Remove all uses of the deprecated functions.

function horizontalOverlap(obj) {
    console.warn("Deprecated function");
    if (this.x < obj.x) {
        return (this.x + this.boundingBox.right) - (obj.x + obj.boundingBox.left);
    } else {
        return (this.x + this.boundingBox.left) - (obj.x + obj.boundingBox.right);
    }
}

function verticalOverlap(obj) {
    console.warn("Deprecated function");
    if (this.y < obj.y) {
        return (this.y + this.boundingBox.bottom) - (obj.y + obj.boundingBox.top);
    } else {
        return (this.y + this.boundingBox.top) - (obj.y + obj.boundingBox.bottom);
    }
}

/**
 * @return {boolean} True if the object is standing on the other one.
 */
function onTopOf(obj) {
    return (!(this.x + this.boundingBox.left >= obj.x + obj.boundingBox.right ||
            this.x + this.boundingBox.right <= obj.x + obj.boundingBox.left) &&
        this.y + this.boundingBox.bottom === obj.y + obj.boundingBox.top);
}


//=================
// Public interface
//=================

var behavior = {};

behavior.getProperties = function() {
    return {
        // variables
        boundingBox: { // FIXME: Defaults from config?
            left: -8,
            right: 8,
            top: -8,
            bottom: 8
        },
        onGround: true,
        wasOnGround: true,

        // Functions
        overlapsObject: overlapsObject,
        overlapsAtOffset: overlapsAtOffset,
        overlapsPoint: overlapsPoint,
        overlapsBy: overlapsBy,
        horizontalOverlap: horizontalOverlap,
        verticalOverlap: verticalOverlap,
        onTopOf: onTopOf
    };
};

behavior.tick = function() {
    var solids = GameState.filter("Solid"),
        i;

    this.wasOnGround = this.onGround;
    this.onGround = false;

    for (i = 0; i < solids.length; i++) {
        if (this.onTopOf(solids[i])) {
            this.onGround = true;
        }
    }
};

Behaviors.register("Physical", behavior);
