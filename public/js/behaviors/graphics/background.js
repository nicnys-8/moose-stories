/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

var Behaviors = require("../../behaviors"),
    GameObject = require("../../game-object");

/**
 * Renders the object.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
 */
function render(ctx) {
    var i;
    for (i = 0; i < this.layers.length; i++) {
        this.layers[i].render(ctx);
    }
}


//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Renderable"];

behavior.getProperties = function() {
    return {
        // Variables
        layers: [],

        // Functions
        render: render // Overwrites the inherited function
    };
};

/**
* Initialization function, called on an object when this behavior is added to it.
*
* @param {[object]} args.layers Array of layer descriptions.
* @param {string} args.layers[i].imagePath Path to image data for the ith layer.
* @param {number} args.layers[i].parallax.x Horizontal parallax of ith layer, between 0 and 1.
* @param {number} args.layers[i].parallax.y Vertical parallax of ith layer, between 0 and 1.

behavior.init = function(args) {
    var layerDescription, i;
    for (i = 0; i < args.layers.length; i++) {
        layerDescription = args.layers[i];
        this.layers[i] = 1;//new GameObject("BackgroundLayer", layerDescription);
    }
    console.log(this);
};*/

Behaviors.register("Background", behavior);
