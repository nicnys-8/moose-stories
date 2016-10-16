/**
 * Defines how in-game dialog is handled.
 */

"use strict";

var Behaviors = require("../behaviors"),
  text = "";

/**
 * Renders the object.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
 */
function render(ctx) {

}

//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Renderable"];

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {};

/**
 * Updates the state of the target object.
 */
behavior.tick = function() {};


Behaviors.register("Dialog", behavior);
