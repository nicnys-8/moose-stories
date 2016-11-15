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
 * Defines the public variables and methods associated with this behavior.
 *
 * @return {object} An object containing behavior variables and methods.
 */
behavior.getProperties = function() {
	return {
		play: null,
		pause: null,
		stop: null,
		looping: false/*,
		getIcon: getIcon*/
	};
};

/**
 * Initialization function, called on an object when this behavior is added to it.
 *
 * @param {string} args.name Name of the song or sound effect.
 */
behavior.init = function(args) {
	let audioTag = null;

	if (!args || !args.name) {
		throw new Error("'Audio' behavior requires argument 'name'.");
	}

	if (typeof filePaths[args.name] === "undefined") {
		throw new Error("The audio name " + args.name + " is not listed in \'filePaths\'.");
	}

	if (cache[args.name]) {
		audioTag = cache[args.name];
	} else {
		audioTag = document.createElement("audio");
		audioTag.src = filePaths[args.name];
		audioTag.load();
		cache[args.name] = audioTag;
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

	if (this.looping) {
		audioTag.addEventListener("ended", function() {
			audioTag.play();
		});
	}
};

Behaviors.register("Audio", behavior);
