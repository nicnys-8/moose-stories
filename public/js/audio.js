"use strict";

/**
 * Constructor of an audio object used for playing sound effects and background music.
 * @param {string} filePath - Relative path of the audio file.
 */
function Audio(filePath) {
    var audioTag = document.createElement("audio");
    audioTag.src = filePath;
    audioTag.load();

    this.play = function() {
        audioTag.play();
    };
}

module.exports = Audio;
