/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

var Behaviors = require("../../behaviors");

/**
 * Renders the object; NOOP function to be implemented by more specific behaviors.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
 */
function render(ctx) {
    throw new Error("This object does not implement a 'render' function.");
}


//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Transform"];

/**
* Defines the public variables and methods associated with this behavior.
*
* @return {object} An object containing behavior variables and methods.
*/
behavior.getProperties = function() {
    return {
        // Variables
        alpha: 1,

        // Functions
        render: render
    };
};

Behaviors.register("Renderable", behavior);
