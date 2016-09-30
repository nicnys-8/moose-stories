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
    standSprite = new GameObject("Sprite", {
        imgPath: "img/sprites/giri/stand.svg",
        numFrames: 1,
        hotspot: hotspot
    }),
    walkSprite = new GameObject("Sprite", {
        imgPath: "img/sprites/giri/walk.svg",
        numFrames: 2,
        hotspot: hotspot,
        imageSpeed: 0.1
    }),
    jumpSprite = new GameObject("Sprite", {
        imgPath: "img/sprites/giri/jump.svg",
        numFrames: 1,
        hotspot: hotspot
    });


//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Renderable", "FaceDirection", "Platform"];

behavior.getProperties = function() {
    return {
        // Variables
        boundingBox: boundingBox,
        hotspot: hotspot,
        sprites: {
            stand: standSprite,
            walk: walkSprite,
            jump: jumpSprite
        },
        currentSprite: standSprite
    };
};

behavior.tick = function() {
    this.currentSprite = (Math.abs(this.speed.x) > 0) ? this.sprites.walk : this.sprites.stand;
    if (!this.onGround) this.currentSprite = this.sprites.jump;
};

Behaviors.register("Player", behavior);
