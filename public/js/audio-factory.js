/**
A singleton factory used to create new sound objects.
These are pretty much just wrappers around audio tags.
*/

"use strict";

var Audio = require("./audio"),
    cache = {},
    AudioFactory = {};

/**
Returns a sound object
* @param {string} filePath - Relative path of the audio file.
*/
AudioFactory.createSound = function(filePath) {
    var audio;

    if (cache[filePath]) {
        audio = cache[filePath];
    } else {
        audio = new Audio(filePath);
        cache[filePath] = audio;
    }
    return audio;
};

module.exports = AudioFactory;
