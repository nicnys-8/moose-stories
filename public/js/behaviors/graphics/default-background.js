/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

var Behaviors = require("../../behaviors"),
    GameObject = require("../../objects/game-object");

/**
 * Renders the object.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
 */
function render(ctx) {
    var i;
    for (i = 0; i < this.layers.length; i++) {
        console.log(this.layers[i]);
        //this.layers[i].render(ctx);
    }
}


//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Background"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 */
behavior.init = function(args) {
    var layerDescriptions, layer, i;

    layerDescriptions = [{
        imagePath: "img/backgrounds/sun.svg",
        x: 400,
        y: 100,
        tiledX: false,
        tiledY: false
    }, {
        imagePath: "img/backgrounds/rainbow.svg",
        x: -350,
        y: 160,
        tiledX: false,
        tiledY: false
    }, {
        imagePath: "img/backgrounds/mountains.svg",
        x: 0,
        y: 360,
        tiledX: true,
        tiledY: false
    }, {
        imagePath: "img/backgrounds/clouds.svg",
        x: 0,
        y: -50,
        tiledX: true,
        tiledY: false
    }, {
        imagePath: "img/backgrounds/controls.svg",
        x: 16,
        y: 16,
        tiledX: false,
        tiledY: false
    }];

    for (i = 0; i < layerDescriptions.length; i++) {
        layer = new GameObject("BackgroundLayer", layerDescriptions[i]);
        this.layers.push(layer);
    }
};

Behaviors.register("DefaultBackground", behavior);
