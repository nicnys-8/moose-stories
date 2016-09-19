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

	var API = {};

	/**
	Returns a sound object
	@param filePath Path to the audio file
	*/
	API.createSound = function(filePath) {
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

	return API;
}();
