/**
 * Describes the behavior of a playable platform character.
 */

"use strict";

require("./sprite");

var Behaviors = require("../behaviors"),
    GameObject = require("../objects/game-object"),
    hotspot = {
        x: 16,
        y: 32
    },
    boundingBox = {
        left: -16,
        right: 16,
        top: -32,
        bottom: 32
    },
    sprite = new GameObject("Sprite", {
        imgPath: "img/sprites/block.svg",
        numFrames: 1,
        hotspot: hotspot
    });

//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Solid", "Renderable"];

behavior.getProperties = function() {
    return {
        // Variables
        boundingBox: boundingBox,
        hotspot: hotspot,
        currentSprite: sprite
    };
};

Behaviors.register("Block", behavior);
