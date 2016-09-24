/**
 * Describes the behavior of a moving object.
 */

"use strict";

var Behaviors = require("./../behaviors");

function applyForceX(force) {
    this.xAcceleration += force / this.weight;
}

function applyForceY(force) {
    this.yAcceleration += force / this.weight;
}

function move(gameState) {
    var solids = gameState.filter("Solid"),
        solid,
        overlap,
        i;

    // TODO: Cram these silly loops into one
    this.x += this.xSpeed;
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
                this.xSpeed = 0;
                break;
            }
        }
    }

    this.y += this.ySpeed;
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
                this.ySpeed = 0;
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
        xAcceleration: 0,
        yAcceleration: 0,
        xSpeed: 0,
        ySpeed: 0,
        maxXSpeed: 3,
        maxYSpeed: 7,
        weight: 32,
        frictionForce: 0.2,

        // Functions
        applyForceX: applyForceX,
        applyForceY: applyForceY,
        move: move
    };
};

behavior.tick = function(gameState) {
    var obj, solidObjects;

    this.xSpeed += this.xAcceleration;
    this.ySpeed += this.yAcceleration;

    // Limit horizontal and vertical speed
    this.xSpeed = Math.max(Math.min(this.xSpeed, this.maxXSpeed), -this.maxXSpeed);
    this.ySpeed = Math.max(Math.min(this.ySpeed, this.maxYSpeed), -this.maxYSpeed);

    this.move(gameState);

    // Friction and gravity
    if (Math.abs(this.xSpeed) > this.frictionForce) {
        this.xAcceleration = -Math.sign(this.xSpeed) * this.frictionForce;
    } else {
        this.xAcceleration = 0;
        this.xSpeed = 0;
    }
    this.yAcceleration = 0.3; // TODO: Replace with gravity
};

Behaviors.register("Moving", behavior);
