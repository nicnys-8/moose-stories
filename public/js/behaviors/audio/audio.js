/**
 * Describes an animated object.
 */

"use strict";

var Behaviors = require("../../behaviors"),
    cache = {}; // Cache for storing audio tags


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
 * @param {string} filePath Relative path of the audio file.
 */
behavior.init = function(args) {
    var audioTag;

    if (!args || !args.filePath) {
        throw new Error("'Audio' behavior requires argument 'filePath'.");
    }

    if (cache[args.filePath]) {
        audioTag = cache[args.filePath];
    } else {
        audioTag = document.createElement("audio");
        audioTag.src = args.filePath;
        audioTag.load();
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
