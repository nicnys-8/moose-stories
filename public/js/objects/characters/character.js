/**
* Base class for playable platform characters
*/

"use strict";

//================================
// Private functions and variables
//================================

var ObjectFactory = require('./../object-factory'),
    GameObject = require("./../game-object"),
    Behaviors = require("./../../behaviors");


//=========================
// Register the object type
//=========================

ObjectFactory.defineClass("Character", {
    superClass: "GameObject",
    behaviors: ["Renderable", "Physical", "Solid", "Moving", "Platform", "FaceDirection", "Controllable"],
    tick: function(gameState) {
        var threshold = 0.1;
        this.currentSprite = (Math.abs(this.hSpeed) > threshold) ? this.sprites.walk : this.sprites.stand;
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
