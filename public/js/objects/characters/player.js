/**
 * A stylish guy
 */

"use strict";

var ObjectFactory = require("./../object-factory");


//=========================
// Register the object type
//=========================

ObjectFactory.defineClass("Player", {
    superClass: "Character",
    init: function(args) {
        var hotspot = {
            x: 16,
            y: 32
        };

        this.boundingBox = {
            left: -16,
            right: 16,
            top: -32,
            bottom: 32
        };

        this.sprites.stand = ObjectFactory.createObject({
            name: "Sprite",
            imgPath: "img/sprites/giri/stand.svg",
            numFrames: 1,
            hotspot: hotspot
        });
        this.sprites.walk = ObjectFactory.createObject({
            name: "Sprite",
            imgPath: "img/sprites/giri/walk.svg",
            numFrames: 2,
            hotspot: hotspot,
            imageSpeed: 0.1
        });
        this.sprites.jump = ObjectFactory.createObject({
            name: "Sprite",
            imgPath: "img/sprites/giri/jump.svg",
            numFrames: 1,
            hotspot: hotspot
        });
        this.currentSprite = this.sprites.stand;
    }
});
