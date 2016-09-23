"use strict";

var ObjectFactory = require("./object-factory"),
    Behaviors = require("./../behaviors");

/**
 * Constructor function for a game object
 */
function GameObject(args, defaults) {

    //===================
    // Instance variables
    //===================

    this.behaviors = {};
    this.ticks = [];
    this.uid = args && args.uid; // This is set in GameState, when the level is parsed
    this.setNumber("x", args, 0);
    this.setNumber("y", args, 0);
}

//=================
// Public functions
//=================

GameObject.prototype.setNumber = function(name, args, defaultValue) {
    var value = (args && +args[name]);
    if (!value && value !== 0) {
        value = defaultValue;
    }
    this[name] = value;
};

GameObject.prototype.setString = function(name, args, defaultValue) {
    this[name] = ("" + args[name]) || defaultValue;
};

/**
 * Returns true if the object has the given behavior, false otherwise.
 * @param {String} behaviorName - Name of the behavior to check for.
 */
GameObject.prototype.hasBehavior = function(behaviorName) {
    return !!this.behaviors[behaviorName];
};

/**
 * Adds an additional function to be performed each tick in the game loop.
 */
GameObject.prototype.addTick = function(fn) {
    this.ticks.push(fn);
};

/**
 * Adds a behavior to the sprite object.
 * @param {String} behaviorName - Name of the behavior to be added.
 */
GameObject.prototype.addBehavior = function(behaviorName) {
    var behavior = Behaviors.get(behaviorName),
        properties,
        i;

    // Check if the behavior has already been added
    if (this.hasBehavior(behaviorName)) {
        console.trace("Trying to add behavior " + behaviorName + " again...");
        return;
    }

    this.behaviors[behaviorName] = true;

    // Add behavior dependencies first!
    if (behavior.dependencies) {
        for (i in behavior.dependencies) {
            this.addBehavior(Behaviors[i]);
        }
    }

    properties = behavior.getProperties();

    // Add all behavior properties
    for (i in properties) {
        // Check for duplicate property names
        if (this.hasOwnProperty(i)) {
            console.trace("Trying to add duplicate of property " + i);
        } else {
            this[i] = properties[i];
        }
    }

    // Modify the target's tick function
    if (behavior.tick) {
        this.ticks.push(behavior.tick);
    }
};

/**
Actions to perform at each iteration of the game loop
*/
GameObject.prototype.tick = function(gameState) {
    var i;
    for (i = 0; i < this.ticks.length; i++) {
        this.ticks[i].call(this, gameState);
    }
};

module.exports = GameObject;
