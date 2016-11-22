/**
 * Describes an animated object.
 */

"use strict";

const Behaviors = require("../../behaviors");
const cache = {}; // Cache for storing audio tags
const filePaths = {
	// Songs
	"Main theme": "audio/music/fnurk.mp3",
	"Space": "audio/music/space.ogg",
	"Moose Music": "audio/music/moose-music.wav",

	// Sound effects
	"Jump": "audio/sounds/jump.wav",
	"Land": "audio/sounds/land.wav"
};

/**
 * @param  {number} [size] - Preferred height and width of the icon.
 * @return {DOM Element} An icon representing the object.

function getIcon(size) {
	const icon = document.createElement("i");
	icon.innerHTML = "&#9835";
	return icon;
} */


//=================
// Public interface
//=================

const behavior = {};

//behavior.dependencies = ["HasIcon"];

/**
 * Initialization function, called on an object when this behavior is added to it.
 *
 * @param {string} name - Name of the song or sound effect.
 */
behavior.init = function({name, looping = false}) {

	let audioTag = null;

	if (typeof name === "undefined") {
		throw new Error("'Audio' behavior requires argument 'name'.");
	}

	if (typeof filePaths[name] === "undefined") {
		throw new Error("The audio name " + name + " is not listed in \'filePaths\'.");
	}

	if (cache[name]) {
		audioTag = cache[name];
	} else {
		audioTag = document.createElement("audio");
		audioTag.src = filePaths[name];
		audioTag.load();
		cache[name] = audioTag;
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

	if (looping) {
		audioTag.addEventListener("ended", function() {
			audioTag.play();
		});
	}
};

Behaviors.register("Audio", behavior);
