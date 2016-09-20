"use strict";

var ObjectFactory = require('./../object-factory'),
    GameObject = require("./../game-object"),
    Behaviors = require("./../../behaviors");

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

/**
A platform character object
*/
ObjectFactory.Character = function(args) {

    GameObject.call(this, args);


    //==============
    // Add behaviors
    //==============

    // Maybe something like this instead of overwriting the
    // tick function and manually calling the other ticks?
    this.addBehavior(function(gameState) {
        var threshold = 0.1;
        this.currentSprite = (Math.abs(this.hSpeed) > threshold) ? this.sprites.walk : this.sprites.stand;
        if (!this.onGround) this.currentSprite = this.sprites.jump;
    });
    this.addBehavior(Behaviors.Renderable);
    this.addBehavior(Behaviors.Physical);
    this.addBehavior(Behaviors.Solid);
    this.addBehavior(Behaviors.Moving);
    this.addBehavior(Behaviors.Platform);
    this.addBehavior(Behaviors.FaceDirection);
    this.addBehavior(Behaviors.Controllable);


    //=================
    // Public interface
    //=================

    this.sprites = {
        stand: null,
        walk: null
    };

};

ObjectFactory.Character.prototype = new GameObject();
