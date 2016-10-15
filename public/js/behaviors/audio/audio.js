/**
 * Describes an animated object.
 */

"use strict";

var Behaviors = require("../../behaviors"),
    cache = {}, // Cache for storing audio tags
    filePaths = {
        // Songs
        "Main theme": "audio/music/fnurk.mp3",
        "Space": "audio/music/space.ogg",
        // Sound effects
        "Jump": "audio/sounds/jump.wav",
        "Land": "audio/sounds/land.wav"
    };


//=================
// Public interface
//=================

var behavior = {};

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
    return {
        play: null,
        pause: null,
        stop: null,
        looping: false
    };
};

/**
 * Initialization function, called on an object when this behavior is added to it.
 *
 * @param {string} args.name Name of the song or sound effect.
 */
behavior.init = function(args) {
    var audioTag;

    if (!args || !args.name) {
        throw new Error("'Audio' behavior requires argument 'name'.");
    }

    if (typeof filePaths[args.name] === "undefined") {
        throw new Error("The audio name " + args.name + " is not listed in \'filePaths\'.");
    }

    if (cache[args.name]) {
        audioTag = cache[args.name];
    } else {
        audioTag = document.createElement("audio");
        audioTag.src = filePaths[args.name];
        audioTag.load();
        cache[args.name] = audioTag;
    }

    this.play = function() {
        audioTag.play();
    };

    this.pause = function() {
        audioTag.pause();
    };

    this.stop = function() {
        audioTag.pause();
        audioTag.currentTime = 0;
    };

    if (this.looping) {
        audioTag.addEventListener("ended", function() {
            audioTag.play();
        });
    }
};

Behaviors.register("Audio", behavior);
