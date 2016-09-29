/**
 * Base class for playable platform characters
 * TODO: Make this a behavior instead?
 */

"use strict";

var ObjectFactory = require('./../object-factory'),
    GameObject = require("./../game-object"),
    Behaviors = require("./../../behaviors");


//=========================
// Register the object type
//=========================

ObjectFactory.defineClass("Character", {
    behaviors: ["Renderable", "Solid", "FaceDirection", "Platform"],
    tick: function(gameState) {
        this.currentSprite = (Math.abs(this.speed.x) > 0) ? this.sprites.walk : this.sprites.stand;
        if (!this.onGround) this.currentSprite = this.sprites.jump;
    },
    init: function(args) {
        this.sprites = {
            stand: null,
            walk: null,
            jump: null
        };
    }
});
