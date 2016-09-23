/**
* A stylish guy
*/

"use strict";

var ObjectFactory = require("./../object-factory"),
    SpriteFactory = require("./../../sprite-factory");


//=========================
// Register the object type
//=========================

ObjectFactory.defineClass("Giri", {
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

        this.sprites.stand = SpriteFactory.createSprite("img/sprites/giri/stand.svg", 1, hotspot);
        this.sprites.walk = SpriteFactory.createSprite("img/sprites/giri/walk.svg", 2, hotspot);
        this.sprites.jump = SpriteFactory.createSprite("img/sprites/giri/jump.svg", 1, hotspot);
        this.sprites.walk.imageSpeed = 0.1;
        this.currentSprite = this.sprites.stand;
    }
});
