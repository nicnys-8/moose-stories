/**
* A block object
*/

"use strict";

//================================
// Private functions and variables
//================================

var ObjectFactory = require("./object-factory"),
    GameObject = require("./game-object"),
    SpriteFactory = require("./../sprite-factory"),
    Behaviors = require("./../behaviors"),
    config = require("./../config.js");

//=========================
// Register the object type
//=========================

ObjectFactory.defineClass("Block", {
    superClass: "GameObject",
    behaviors: ["Renderable", "Physical", "Solid"],
    defaults: {
        width: config.tileSize,
        height: config.tileSize
    },
    init: function(args, defaults) {
        var width = args.width,
            height = args.height,
            hotspot = {
                x: width / 2,
                y: height / 2
            };

        this.currentSprite = SpriteFactory.createSprite("img/sprites/block.svg", 1, hotspot);

        this.scale.x = width / defaults.width;
        this.scale.y = height / defaults.height;

        this.boundingBox = {
            left: -width / 2,
            right: width / 2,
            top: -height / 2,
            bottom: height / 2
        };
    }
});
