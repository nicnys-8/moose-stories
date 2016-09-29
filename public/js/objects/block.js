/**
 * A block object
 */

"use strict";

var ObjectFactory = require("./object-factory"),
    config = require("./../config.js");


//=========================
// Register the object type
//=========================

ObjectFactory.defineClass("Block", {
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

        this.currentSprite = ObjectFactory.createObject({
            name: "Sprite",
            imgPath: "img/sprites/block.svg",
            numFrames: 1,
            hotspot: hotspot
        });
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
