/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

var Behaviors = require("../../behaviors"),
    GameObject = require("../../game-object");

/**
 * Renders the object.
 *
 * @param {CanvasRenderingContext2D} ctx 2D rendering context.
 * @param {number} offsetX Horizontal position of the center of the viewport.
 * @param {number} offsetY Vertical position of the center of the viewport.
 */
function render(ctx, offsetX, offsetY) {
    var i;
    for (i = 0; i < this.layers.length; i++) {
        this.layers[i].render(ctx, offsetX, offsetY);
    }
}


//=================
// Public interface
//=================

var behavior = {};

/**
* Defines the public variables and methods associated with this behavior.
*
* @return {object} An object containing behavior variables and methods.
*/
behavior.dependencies = ["Renderable"];

behavior.getProperties = function() {
    return {
        // Variables
        layers: [],

        // Functions
        render: render // Overwrites the inherited function
    };
};

Behaviors.register("Background", behavior);
