/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

var Behaviors = require("../../behaviors"),
    GameObject = require("../../game-object");


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
        imagePath: "img/backgrounds/mountains.svg",
        x: 0,
        y: 360,
        tiledX: true,
        tiledY: false
    }];

    for (i = 0; i < layerDescriptions.length; i++) {
        layer = new GameObject("BackgroundLayer", layerDescriptions[i]);
        this.layers.push(layer);
    }
};

Behaviors.register("MountainBackground", behavior);
