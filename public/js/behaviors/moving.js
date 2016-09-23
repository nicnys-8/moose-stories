/**
 * Describes the behavior of a moving object.
 */

"use strict";

//================================
// Private functions and variables
//================================

var Behaviors = require("./../behaviors");

function objectsToMove(gameState, deltaX, deltaY) {
    var objects = gameState.objectsInZone(
        Math.min(this.x + this.boundingBox.left, this.x + this.boundingBox.left + deltaX),
        Math.max(this.x + this.boundingBox.right, this.x + this.boundingBox.right + deltaX),
        Math.min(this.y + this.boundingBox.top, this.y + this.boundingBox.top + deltaY),
        Math.max(this.y + this.boundingBox.bottom, this.y + this.boundingBox.bottom + deltaY)
    );

    return objects;
}

/**
 * Returns the moving objects directly on top of this object, i.e objects carried by this.
 *	(This function is not recursive, so it only returns the
 *	objects standing directly on the target)
 *
 * @return {[GameObjects]} Carried objects.
 */
function carriedObjects(gameState) {
    var objects = gameState.objectsInZone(
            this.x + this.boundingBox.left,
            this.x + this.boundingBox.right,
            this.y + this.boundingBox.top - 1,
            this.y + this.boundingBox.bottom
        ),
        carried = [],
        obj,
        i;

    for (i = 0; i < objects.length; i++) {
        obj = objects[i];
        if (obj.hasBehavior("Moving") && obj.onTopOf(this)) {
            carried.push(obj);
        }
    }
    return carried;
}

/**
Attempt to move the object
@param deltaX The horizontal distance to travel
@param deltaX The vertical distance to travel
@param gameState Object describing the entire game state
*/
function move(deltaX, deltaY, gameState) {
    var threshold = 0.1; //@TODO: Flytta ut det här nånstans vettigt
    if (Math.abs(deltaY) > threshold) {
        if (this.canMove(deltaY, "y", gameState)) {
            this.tryMove(deltaY, "y", gameState);
        }
    }
    if (Math.abs(deltaX) > threshold) {
        if (this.canMove(deltaX, "x", gameState)) {
            this.tryMove(deltaX, "x", gameState);
        }
    }
}

function canMove(delta, coordinate, gameState) {
    var deltaX, deltaY, speedVar;

    // Set up coordinate dependent variables and variable names
    switch (coordinate) {
        case "x":
            deltaX = delta;
            deltaY = 0;
            speedVar = "hSpeed";
            break;
        case "y":
            deltaX = 0;
            deltaY = delta;
            speedVar = "vSpeed";
            break;
        default:
            throw new Error("Not a valid coordinate.");
    }

    // Find all objects within the area that will be traversed
    var objects = this.objectsToMove(gameState, deltaX, deltaY),
        direction = delta ? delta < 0 ? -1 : 1 : 0, // Calculate the direction of delta
        staticObjects = gameState.filter("Moving", "exclude", objects), //@TODO: Only solids though, right?
        prev = this[coordinate],
        i, currentObject, overlap, carried, obj;

    // Test moving the object
    this[coordinate] = Math.round(this[coordinate] + delta);
    for (i = 0; i < staticObjects.length; i++) {
        currentObject = staticObjects[i];
        if (this.overlapsObject(currentObject)) {
            overlap = this.overlapsBy(currentObject, coordinate);
            if (Math.abs(overlap) >= delta) {
                // Can't move the object.
                // Restore state and return.
                this[coordinate] = prev;
                return false;
            }
        }
    }
    this[coordinate] = prev;
    // Object could be moved.

    // Recursively check all carried objects
    // Only needed if we are travelling in y direction...
    if (coordinate === "y") {
        carried = this.carriedObjects(gameState);
        for (i = 0; i < carried.length; i++) {
            obj = carried[i];
            if (!obj.canMove(delta, coordinate, gameState)) {
                return false;
            }
        }
    }

    return true;
}

/**
Attemt to move object in a specified direction.
@param delta The distance to travel
@param coordinate The coordinate along which to move
@param gameState Object describing the game
*/
function tryMove(delta, coordinate, gameState) {
    var deltaX,
        deltaY,
        speedVar;

    // Set up coordinate dependent variables and variable names
    switch (coordinate) {
        case "x":
            deltaX = delta;
            deltaY = 0;
            speedVar = "hSpeed";
            break;
        case "y":
            deltaX = 0;
            deltaY = delta;
            speedVar = "vSpeed";
            break;
        default:
            throw new Error("Not a valid coordinate.");
    }

    // Find all objects within the area that will be traversed
    var objects = this.objectsToMove(gameState, deltaX, deltaY),
        carried = this.carriedObjects(gameState),
        direction = delta ? delta < 0 ? -1 : 1 : 0, // Calculate the direction of delta
        prev = this[coordinate],
        obj,
        steps,
        pushDistance,
        i;

    // Move the object
    this[coordinate] = Math.round(this[coordinate] + delta);

    // Check for collisions
    for (i = 0; i < objects.length; i++) {
        obj = objects[i];
        // Ignore collisions with itself
        if (this === obj) {
            continue;
        }

        if (this.overlapsObject(obj)) {
            // Try pushing the obstacle
            pushDistance = this.overlapsBy(obj, coordinate);
            if (obj.hasBehavior("Moving") && (coordinate !== "y" || deltaY < 0)) {
                obj.tryMove(pushDistance, coordinate, gameState);
            } else {
                // If the obstacle can't be pushed, stop moving
                this[speedVar] = 0;
            }

            // Move back until there is no overlap
            while (this.overlapsObject(obj)) {
                this[coordinate] -= direction;
            }

            /* (Another piece of ugliness...
            vSpeed must be set to zero if the object hits a ceiling or something...)
            */
            if (coordinate === "y" && this[coordinate] === prev) this.vSpeed = 0;
        }
    }

    // Move carried objects or drag carried objects down
    pushDistance = this[coordinate] - prev;
    if (coordinate !== "y" || deltaY > 0) {
        for (i = 0; i < carried.length; i++) {
            obj = carried[i];
            obj.hasBeenCarriedThisTick = true;
            obj.tryMove(pushDistance, coordinate, gameState);
        }
    }
}

//=================
// Public interface
//=================

var behavior = {};

behavior.getProperties = function() {
    return {
        // Variables
        hAcceleration: 0,
        vAcceleration: 0.3,
        hSpeed: 0,
        vSpeed: 0,
        maxHSpeed: 2,
        maxVSpeed: 7,
        strength: 3,

        // Functions
        move: move,
        canMove: canMove,
        tryMove: tryMove,
        carriedObjects: carriedObjects,
        objectsToMove: objectsToMove
    };
};

behavior.tick = function(gameState) {
    var obj, solidObjects;

    this.hSpeed += this.hAcceleration;
    this.vSpeed += this.vAcceleration;

    // Limit vSpeed to maxVSpeed in either direction
    this.vSpeed = Math.max(Math.min(this.vSpeed, this.maxVSpeed), -this.maxVSpeed);
    // Limit hSpeed to maxHSpeed in either direction
    this.hSpeed = Math.max(Math.min(this.hSpeed, this.maxHSpeed), -this.maxHSpeed);

    this.move(this.hSpeed, this.vSpeed, gameState);
};

Behaviors.register("Moving", behavior);
