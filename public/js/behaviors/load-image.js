/**
 * This behavior lets an object load image data.
 */

"use strict";


var Behaviors = require("../behaviors"),
    canvases = {}; // Private canvas cache

/**
 * Loads an image from file and draws it in a canvas.
 * The canvas is reused for every subsequent call with the same parameter.
 * The function returns the canvas.
 *
 * @param {string} imagePath Path to the image file.
 * @return {HTMLCanvasElement} A canvas containing the loaded image.
 */
function loadImage(imagePath) {
    var canvas;
    if (canvases.hasOwnProperty(imagePath)) {
        canvas = canvases[imagePath];
    } else {
        var img = new Image();

        img.src = imagePath;
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0);
        };

        canvas = document.createElement("canvas");
        canvases[imagePath] = canvas;
    }
    return canvas;
}


//=================
// Public interface
//=================

var behavior = {};

/**
* Returns the public variables and methods associated with this behavior.
* @return {object} An object containing behavior variables and methods.
*/
behavior.getProperties = function() {
    return {
        loadImage: loadImage
    };
};

Behaviors.register("LoadImage", behavior);
