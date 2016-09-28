/**
 * Describes the behavior of a moving object.
 */

"use strict";

var GameState = require("./../game-state"),
    Behaviors = require("./../behaviors"),
    friction = 0.2, // TODO: Move to GameState? Or somewhere else?
    gravity = 0.3; // TODO: Move to GameState

/**
 * Applies a force on the object, affecting its horizontal acceleration.
 *
 * @param {number} force The applied force, negative values for left, positive for right.
 */
function applyForceX(force) {
    this.acceleration.x += force / this.weight;
}

/**
 * Applies a force on the object, affecting its vertical acceleration.
 *
 * @param {number} force The applied force, negative values for up, positive for down.
 */
function applyForceY(force) {
    this.acceleration.y += force / this.weight;
}

function move() {
    var solids = GameState.filter("Solid"),
        solid,
        overlap,
        i;

    // TODO: Cram these silly loops into one
    this.x += this.speed.x;
    for (i = 0; i < solids.length; i++) {
        solid = solids[i];
        if (this.overlapsObject(solid)) {
            // Don't check for collisions with itself
            if (solid === this) {
                continue;
            }
            overlap = this.overlapsBy(solid, "x");

            if (overlap !== 0) {
                //this.x -= overlap;
                this.x = Math.round(this.x - overlap);
                this.speed.x = 0;
                break;
            }
        }
    }

    this.y += this.speed.y;
    for (i = 0; i < solids.length; i++) {
        solid = solids[i];
        if (this.overlapsObject(solid)) {
            // Don't check for collisions with itself
            if (solid === this) {
                continue;
            }
            overlap = this.overlapsBy(solid, "y");

            if (overlap !== 0) {
                //this.y -= overlap;
                this.y = Math.round(this.y - overlap);
                this.speed.y = 0;
                break;
            }
        }
    }
}

//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Physical"];

behavior.getProperties = function() {
    return {
        // Variables
        speed: {
            x: 0,
            y: 0,
        },
        maxSpeed: {
            x: 2.5,
            y: 9
        },
        acceleration: {
            x: 0,
            y: 0,
        },
        weight: 32,

        // Functions
        applyForceX: applyForceX,
        applyForceY: applyForceY,
        move: move
    };
};

behavior.tick = function() {
    var obj, solidObjects;

    this.speed.x += this.acceleration.x;
    this.speed.y += this.acceleration.y;

    // Limit horizontal and vertical speed
    this.speed.x = Math.max(Math.min(this.speed.x, this.maxSpeed.x), -this.maxSpeed.x);
    this.speed.y = Math.max(Math.min(this.speed.y, this.maxSpeed.y), -this.maxSpeed.y);

    this.move();

    // Friction and gravity
    if (Math.abs(this.speed.x) > friction) {
        this.acceleration.x = -Math.sign(this.speed.x) * friction;
    } else {
        this.acceleration.x = 0;
        this.speed.x = 0;
    }
    this.acceleration.y = gravity;
};

Behaviors.register("Moving", behavior);
