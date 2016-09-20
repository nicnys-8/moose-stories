"use strict";

/**
A controller object that can be used to control
events in the game through key presses
*/
function Keyboard() {

	//================================
	// Private functions and variables
	//================================

	// Lookup object for translating key codes to key names
	var keyMappings = {
		37: "left",
		38: "up",
		39: "right",
		40: "down",
		67: "c",
		86: "v",
		88: "x",
		90: "z"
	};

	// Object for storing key events that occured during the last tick
	var keyEvents = {};

	// Object for storing the current state of keys, e.g:
	// {left: "up", up: "released", right: "pressed", down: "up"}
	var keyStates = {};

	// Initialize keyStates
	for (var code in keyMappings) {
		var key = keyMappings[code];
		keyStates[key] = "up";
	}

	/**
	Function to call when a key is pressed -
	updates keyEvents accordingly
	*/
	function onKeyDown(event) {
		var code = event.keyCode;
		var key = keyMappings[code];
		if (keyStates[key] === "up") {
			keyEvents[key] = "pressed";
		}
	}

	/**
	Function to call when a key is released -
	updates keyEvents accordingly
	*/
	function onKeyUp(event) {
		var code = event.keyCode;
		var key = keyMappings[code];
		if (keyStates[key] === "down") {
			keyEvents[key] = "released";
		}
	}

	window.addEventListener("keydown", onKeyDown, false);
	window.addEventListener("keyup", onKeyUp, false);


	//=================
	// Public Interface
	//=================

	/**
	Returns true if the key is not pressed
	@param key Name of the key to check, e.g. "up"
	*/
	this.up = function(key) {
		return (!keyStates.hasOwnProperty(key) ||
			keyStates[key] === "up" ||
			keyStates[key] === "released");
	};

	/**
	Returns true if the key is down
	@param key Name of the key to check, e.g. "up"
	*/
	this.down = function(key) {
		return (keyStates[key] === "down" ||
			keyStates[key] === "pressed");
	};

	/**
	Returns true if the key was pressed during the current tick
	@param key Name of the key to check, e.g. "up"
	*/
	this.pressed = function(key) {
		return (keyStates[key] === "pressed");
	};

	/**
	Returns true if the key was released during the current tick
	@param key Name of the key to check, e.g. "up"
	*/
	this.released = function(key) {
		return (keyStates[key] === "released");
	};

	/**
	Function to call on every game loop iteration,
	updates keyStates based on the keyEvents that have occured since the last tick
	*/
	this.tick = function() {
		var key;
		
		for (key in keyStates) {
			if (keyStates[key] === "released") {
				keyStates[key] = "up";
			}

			if (keyStates[key] === "pressed") {
				keyStates[key] = "down";
			}
		}

		for (key in keyEvents) {
			keyStates[key] = keyEvents[key];
		}
		// Clear events
		keyEvents = {}; //@TODO: Det här kan nog göras på ett bättre sätt
	};
}

module.exports = Keyboard;
