/**
A singleton factory used to create new sound objects.
These are pretty much just wrappers around audio tags.
*/

var AudioFactory = function() {

	//==================
	// Private variables
	//==================

	var cache = {};


	//===========
	// Public API
	//===========

	var factory = {};

	/**
	Loads a file from file into an audio tag.
	The tag is reused for every subsequent call with the same parameter.
	The function returns the audio tag.
	@param filePath Path to the audio file
	*/
	factory.loadSound = function(filePath) {
		var sound = {};

		if (cache.hasOwnProperty(filePath)) {
			sound.audioTag = cache[filePath];
		} else {
			sound.audioTag = document.createElement("audio");
			sound.audioTag.load();
			cache[filePath] = sound.audioTag;
		}

		sound.play = function() {
			// Weird fix to a chrome problem:
			if (window.chrome) {
				sound.audioTag.src = filePath;
			}
			sound.audioTag.play();
		};
		return sound;
	};

	/**
	Returns a sound object
	@param filePath Path to the audio file
	*/
	factory.createSound = function(filePath) {
		return this.loadSound(filePath);
	};

	return factory;
}();
