/**
 * Describes the behavior of an object that handles keyboard input.
 */

"use strict";

const Behaviors = require("../behaviors");
const keyMappings = { // Translates key codes to key names
	37: "left",
	38: "up",
	39: "right",
	40: "down",
	67: "c",
	86: "v",
	88: "x",
	90: "z"
};
const behavior = {};

/**
 * Function that is called on an object when this behavior is added to it.
 */
behavior.init = function() {

	// Object for storing the current state of keys,
	// e.g. {left: "up", up: "released", right: "pressed", down: "up"}:
	let keyStates = {};

	// Object for storing all key events that occured during the last tick:
	let keyEvents = {};

	/**
	 * @param  {string}  key - Name of the key to check, e.g. "right"
	 * @return {boolean} True if the key is not pressed.
	 */
	this.up = function(key) {
		return (!keyStates.hasOwnProperty(key) ||
			keyStates[key] === "up" ||
			keyStates[key] === "released");
	};

	/**
	 * @param  {string}  key - Name of the key to check, e.g. "right"
	 * @return {boolean} True if the key is pressed.
	 */
	this.down = function(key) {
		return (keyStates[key] === "down" ||
			keyStates[key] === "pressed");
	};

	/**
	 * @param  {string}  key Name - of the key to check, e.g. "right"
	 * @return {boolean} true if the key was pressed during the current tick
	 */
	this.pressed = function(key) {
		return (keyStates[key] === "pressed");
	};

	/**
	 * @param  {string}  key - Name of the key to check, e.g. "right".
	 * @return {boolean} True if the key was released during the current tick.
	 */
	this.released = function(key) {
		return (keyStates[key] === "released");
	};

	// Initialize keyStates
	for (let code in keyMappings) {
		const key = keyMappings[code];
		keyStates[key] = "up";
	}

	// Set up key event listeners
	window.addEventListener("keydown", (event) => {
		const code = event.keyCode;
		const key = keyMappings[code];

		if (keyStates[key] === "up") {
			keyEvents[key] = "pressed";
		}
	}, false);

	window.addEventListener("keyup", (event) => {
		const code = event.keyCode;
		const key = keyMappings[code];

		if (keyStates[key] === "down") {
			keyEvents[key] = "released";
		}
	}, false);

	/**
	 * Add function for updating the object.
	 */
	this.onUpdate(() => {
		for (let key in keyStates) {
			if (keyStates[key] === "released") {
				keyStates[key] = "up";
			}

			if (keyStates[key] === "pressed") {
				keyStates[key] = "down";
			}
		}

		for (let key in keyEvents) {
			keyStates[key] = keyEvents[key];
		}
		// Clear events
		keyEvents = {};
	});
};

Behaviors.register("Keyboard", behavior);
