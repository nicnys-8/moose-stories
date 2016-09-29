/**
 * Describes the behavior of an object that can load image data.
 */

"use strict";

// Private dictionary for caching canvases.
var canvases = {};

/**
 * Loads an image from file and draws it in a canvas.
 * The canvas is reused for every subsequent call with the same parameter.
 * The function returns the canvas.
 *
 * @param {string} imgPath Path to the image file.
 * @return {HTMLCanvasElement} A canvas containing the loaded image.
 */
function loadImage(imgPath) {
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
}

var Behaviors = require("./../behaviors");

//=================
// Public interface
//=================

var behavior = {};

behavior.getProperties = function() {
    return {
        loadImage: loadImage
    };
};

Behaviors.register("LoadImage", behavior);
