/**
 * This behavior lets an object load image data.
 */

"use strict";


const Behaviors = require("../../behaviors");
const canvases = {}; // Canvas cache

/**
 * Loads an image from file and draws it in a canvas.
 * The canvas is reused for every subsequent call with the same parameter.
 * The function returns the canvas.
 *
 * @param {string} imagePath    - Path to the image file.
 * @param {function} [callback] - Function to call once the image is loaded.
 *                                The canvas is passed as an argument.
 * @return {HTMLCanvasElement} A canvas containing the loaded image.
 */
function loadImage(imagePath, callback) {
	let canvas = null;
	if (canvases.hasOwnProperty(imagePath)) {
		canvas = canvases[imagePath];
	} else {
		const img = new Image();

		img.src = imagePath;
		img.onload = function() {
			canvas.width = img.width;
			canvas.height = img.height;
			canvas.getContext("2d").drawImage(img, 0, 0);
			if (typeof callback === "function") {
				callback(canvas);
			}
		};

		canvas = document.createElement("canvas");
		canvases[imagePath] = canvas;
	}
	return canvas;
}

/**
 * Loads a number of images using 'loadImage'.
 *
 * @param {[string]} imagePaths - Array of paths to the image files.
 * @param {function} [callback] - Function to call once the images are loaded.
 * @return {HTMLCanvasElement} A canvas containing the loaded image.

function loadImages(imagePaths, callback) {
    const numImages = imagePaths,
        numWaiting = imagePaths.length,
        loadTasks = [];

    imagePaths.forEach(function(imagePath) {
        loadImage(imagePath, function() {
            numWaiting--;
            if (numWaiting === 0 && typeof callback === "function") {
                callback();
            }
        });
    });
} */


//=================
// Public interface
//=================

const behavior = {};

/**
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
	return {
		loadImage: loadImage
	};
};

Behaviors.register("LoadImage", behavior);
