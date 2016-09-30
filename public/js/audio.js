"use strict";

// Cache for storing audio tags
var cache = {};

/**
 * Instantiates an audio object used for playing sound effects or background music.
 *
 * @constructor
 * @this {Audio}
 * @param {string} filePath - Relative path of the audio file.
 */
function Audio(filePath) {
    var audioTag;
    if (cache[filePath]) {
      audioTag = cache[filePath];
    } else {
      audioTag = document.createElement("audio");
      audioTag.src = filePath;
      audioTag.load();
    }
    this.play = function() {
        audioTag.play();
    };
}

module.exports = Audio;
