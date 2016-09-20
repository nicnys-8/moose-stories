"use strict";

/**
A singleton factory used to create new sprites.
It reuses sprite canvases, so that any two sprites
with identical file paths will use the same canvas
*/

//==================
// Private variables
//==================

var Sprite = require("./sprite"),
	canvases = {};


//===========
// Public API
//===========

var SpriteFactory = {};

/**
Loads an image from file and draws it in a canvas.
The canvas is reused for every subsequent call with the same parameter.
The function returns the canvas.
@param imgPath Path to the image file
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
Returns a sprite object
@param imgPath Path to the image file
@param numFrames The number of frames of the animation
@param hotspot Anchorpoint of the sprite relative to
the upper corner of each frame, e.g. {x: 8, y: 8}
*/
SpriteFactory.createSprite = function(imgPath, numFrames, hotspot) {
    var canvas = this.loadImage(imgPath);
    return new Sprite(canvas, numFrames, hotspot);
};

module.exports = SpriteFactory;
