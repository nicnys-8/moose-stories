"use strict";

var Behaviors = require("./behaviors");

/**
 * Instantiates a new game object
 *
 * @param {[string]} behaviors The name of a behavior, or an array of behavior names.
 * @param {object} args Container for all arguments to the object.
 * @constructor
 * @this {GameObject}
 */
function GameObject(behaviors, args) {
    var i;

    this.behaviors = {};
    this.ticks = [];
    this.uid = args && args.uid; // This is set in GameState, when the level is parsed (and it's a number, right?)

    // Add all behaviors
    behaviors = [].concat(behaviors); // Turn into array
    behaviors.forEach(behavior => {
        this.addBehavior(behavior, args);
    });
}

/**
 * Returns true if the object has the given behavior, false otherwise.
 *
 * @param {String} behaviorName - Name of the behavior to check for.
 */
GameObject.prototype.hasBehavior = function(behaviorName) {
    return !!this.behaviors[behaviorName];
};

/**
 * Adds an additional function to be performed each tick in the game loop.
 *
 * @param {function} fn The added function.
 */
GameObject.prototype.addTick = function(fn) {
    this.ticks.push(fn);
};

/**
 * Adds a behavior, together with all of its dependencies, to the game object.
 *
 * @param {String} behaviorName Name of the behavior to be added.
 * @param {obj} Arguments object that will be passed to the behaviors 'init' functions.
 */
GameObject.prototype.addBehavior = function(behaviorName, args) {
    var behavior = Behaviors.get(behaviorName),
        properties,
        i;

    // Check if the behavior exists
    if (behavior === null) {
        console.log(this);
        throw new Error(behaviorName + " is not a registered behavior.");
    }

    // Check if the behavior has already been added to this object
    if (this.hasBehavior(behaviorName)) {
        return;
    }

    this.behaviors[behaviorName] = true;

    // Add dependencies
    if (behavior.dependencies) {
        for (i = 0; i < behavior.dependencies.length; i++) {
            this.addBehavior(behavior.dependencies[i], args);
        }
    }

    // Add default behavior properties
    if (behavior.getProperties) {
        properties = behavior.getProperties();
        for (i in properties) {
            this[i] = properties[i];
        }
    }

    // Overwrite default properties with argument values
    for (i in args) {
        if (typeof this[i] !== "undefined") {
            this[i] = args[i];
        }
    }

    // Modify the target's tick function
    if (behavior.tick) {
        this.ticks.push(behavior.tick);
    }

    // Run initialization code
    if (behavior.init) {
        behavior.init.call(this, args);
    }
};

/**
 * Runs all of the objects tick functions, i.e. one iteration of the game loop.
 */
GameObject.prototype.tick = function() {
    var i;
    for (i = 0; i < this.ticks.length; i++) {
        this.ticks[i].call(this);
    }
};

module.exports = GameObject;
