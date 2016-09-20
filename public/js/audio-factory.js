"use strict";

/**
A singleton factory used to create new sound objects.
These are pretty much just wrappers around audio tags.
*/

	//==================
	// Private variables
	//==================

	var cache = {};


	//===========
	// Public API
	//===========

	var AudioFactory = {};

	/**
	Returns a sound object
	@param filePath Path to the audio file
	*/
	AudioFactory.createSound = function(filePath) {
		var audioTag;

		if (cache[filePath]) {
			audioTag = cache[filePath];
		} else {
			audioTag = document.createElement("audio");
			audioTag.src = filePath;
			audioTag.load();
			cache[filePath] = audioTag;
		}
		return audioTag;
	};

module.exports = AudioFactory;
