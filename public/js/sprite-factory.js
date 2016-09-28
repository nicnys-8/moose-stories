/**
 * A singleton factory used to create new sprites.
 * It reuses sprite canvases, so that any two sprites
 * with identical file paths will use the same canvas
*/

"use strict";

var Sprite = require("./sprite"),
	canvases = {};


//===========
// Public API
//===========

var SpriteFactory = {};

/**
 * Loads an image from file and draws it in a canvas.
 * The canvas is reused for every subsequent call with the same parameter.
 * The function returns the canvas.
 * @param {string} imgPath Path to the image file.
 * @return {HTMLCanvasElement} A canvas containing the loaded image.
 */
SpriteFactory.loadImage = function(imgPath) {
    var canvas;
    if (canvases.hasOwnProperty(imgPath)) {
        canvas = canvases[imgPath];
    } else {
        var img = new Image();

        img.src = imgPath;
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0);
        };

        canvas = document.createElement("canvas");
        canvases[imgPath] = canvas;
    }
    return canvas;
};

/**
 * @param  {string} imgPath Path to the image file.
 * @param  {number} numFrames The number of frames of the animation.
 * @param  {object} hotspot Anchorpoint of the sprite relative to the upper corner of each frame, e.g. {x: 8, y: 8}.
 * @return {Sprite} The requested sprite object.
 */
SpriteFactory.createSprite = function(imgPath, numFrames, hotspot) {
    var canvas = this.loadImage(imgPath);
    return new Sprite(canvas, numFrames, hotspot);
};

module.exports = SpriteFactory;
