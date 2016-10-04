/**
 * Describes the behavior of an object that handles keyboard input.
 */

"use strict";

var Behaviors = require("../behaviors"),
    keyMappings = { // Yranslates key codes to key names
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        67: "c",
        86: "v",
        88: "x",
        90: "z"
    };

/**
 * @param {string} key Name of the key to check, e.g. "up"
 * @return {boolean} True if the key is not pressed.
 */
function up(key) {
    return (!this.keyStates.hasOwnProperty(key) ||
        this.keyStates[key] === "up" ||
        this.keyStates[key] === "released");
}

/**
 * @param {string} key Name of the key to check, e.g. "up"
 * @return {boolean} True if the key is pressed.
 */
function down(key) {
    return (this.keyStates[key] === "down" ||
        this.keyStates[key] === "pressed");
}

/**
 * @param {string} key Name of the key to check, e.g. "up"
 * @return {boolean} true if the key was pressed during the current tick
 */
function pressed(key) {
    return (this.keyStates[key] === "pressed");
}

/**
 * @param {string} key Name of the key to check, e.g. "up".
 * @return {boolean} True if the key was released during the current tick.
 */
function released(key) {
    return (this.keyStates[key] === "released");
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
        // Variables

        // Object for storing the current state of keys, e.g:
        // {left: "up", up: "released", right: "pressed", down: "up"}:
        keyStates: {},
        // Object for storing all key events that occured during the last tick
        keyEvents: {},

        // Functions
        up: up,
        down: down,
        pressed: pressed,
        released: released
    };
};

/**
 * Updates the state of the target object.
 */
behavior.tick = function() {
    var key;
    for (key in this.keyStates) {
        if (this.keyStates[key] === "released") {
            this.keyStates[key] = "up";
        }

        if (this.keyStates[key] === "pressed") {
            this.keyStates[key] = "down";
        }
    }

    for (key in this.keyEvents) {
        this.keyStates[key] = this.keyEvents[key];
    }
    // Clear events
    this.keyEvents = {};
};

/**
 * Function that is called on an object when this behavior is added to it.
 */
behavior.init = function() {
    var self = this;

    // Initialize keyStates
    for (var code in keyMappings) {
        var key = keyMappings[code];
        this.keyStates[key] = "up";
    }

    // Set up key event listeners
    window.addEventListener("keydown", function(event) {
        var code = event.keyCode;
        var key = keyMappings[code];
        if (self.keyStates[key] === "up") {
            self.keyEvents[key] = "pressed";
        }
    }, false);
    window.addEventListener("keyup", function(event) {
        var code = event.keyCode;
        var key = keyMappings[code];
        if (self.keyStates[key] === "down") {
            self.keyEvents[key] = "released";
        }
    }, false);
};

Behaviors.register("Keyboard", behavior);
