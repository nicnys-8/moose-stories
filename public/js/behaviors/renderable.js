/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

var Behaviors = require("../behaviors");

/**
 * Renders the object; NOOP function to be implemented by more specific behaviors.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
 */
function render(ctx) {}


//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["LoadImage"];

behavior.getProperties = function() {
    return {
        // Functions
        render: render
    };
};

Behaviors.register("Renderable", behavior);
