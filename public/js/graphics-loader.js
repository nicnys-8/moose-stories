/**
 * This behavior lets an object load image data.
 */

"use strict";

const canvases = {}; // Canvas cache
const onLoadFunctions = [];

let numPendingRequests = 0;

/**
* Schedules a function to be called when all images have finished loading.
* @param {function} fn - The function to call.
*/
function onLoad(fn) {
	if (typeof fn !== "function") {
		throw new Error("'onLoad' takes a function as argument, saw " + typeof fn + ".");
	}
	onLoadFunctions.push(fn);
}

/**
* Calls all functions scheduled to run upon finishing loading graphics.
*/
function runListeners() {
	onLoadFunctions.forEach(fn => {
		fn();
	});
}

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
function loadImage(imagePath) {
	let canvas = null;
	if (canvases.hasOwnProperty(imagePath)) {
		canvas = canvases[imagePath];
	} else {
		const img = new Image();
		canvas = document.createElement("canvas");
		img.src = imagePath;
		numPendingRequests++;

		img.onload = function() {
			numPendingRequests--;
			canvas.width = img.width;
			canvas.height = img.height;
			canvas.getContext("2d").drawImage(img, 0, 0);
			if (numPendingRequests === 0) { // If all graphics have finished loading:
				runListeners();
			}
		};

		canvases[imagePath] = canvas;
	}
	return canvas;
}


//=================
// Public interface
//=================

module.exports = {
	loadImage,
	onLoad
};
