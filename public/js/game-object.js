"use strict";

const Behaviors = require("./behaviors");

class GameObject {

	/**
	 * Instantiates a new game object with the specified behaviors.
	 *
	 * Example usage:
	 *    - new GameObject("Moving");
	 *		  Creates  game object with 'Moving' behavior.
	 *	  - new GameObject({Audio: {name: "champs-elysees"}});
	 *        Creates game object with 'Audio' behavior, passing the
	 *        {name: "champs-elysees"} as an argument to the behavior's init function.
	 *
	 * @param {string|object} args - The name of a behavior, or a dictionary
	 *                               mapping behavior names to arguments.
	 */
	constructor(args) {
		this.behaviors = {};
		this.ticks = [];
		this.uid = args && args.uid; // This is set in GameState, when the level is parsed (and it's a number, right?)

		if (typeof args === "string") {
			const behaviorName = args;
			this.addBehavior(behaviorName);
		} else {
			for (let behaviorName in args) {
				this.addBehavior(behaviorName, args);
			}
		}
	}

    /**
     * Returns true if the object has the given behavior, false otherwise.
     *
     * @param {String} behaviorName - Name of the behavior to check for.
     */
    hasBehavior(behaviorName) {
    	return !!this.behaviors[behaviorName];
    }

    /**
     * Adds an additional function to be performed each tick in the game loop.
     *
     * @param {function} fn - The added function.
     */
    onUpdate(fn) {
    	this.ticks.push(fn);
    }

    /**
     * Adds a behavior, together with all of its dependencies, to the game object.
     *
     * @param {String} behaviorName - Name of the behavior to be added.
     * @param {obj} args - object that will be passed to the behaviors 'init' functions.
     */
    addBehavior(behaviorName, args = {}) {
    	const behavior = Behaviors.get(behaviorName);

    	// Check if the behavior exists
    	if (behavior === null) {
    		throw new Error(behaviorName + " is not a registered behavior.");
    	}

    	// Check if the behavior has already been added to this object
    	if (this.hasBehavior(behaviorName)) {
    		return;
    	}

    	this.behaviors[behaviorName] = true;

    	// Add dependencies
    	if (behavior.dependencies) {
    		behavior.dependencies.forEach(dependency => {
					this.addBehavior(dependency, args);
    		});
    	}
		// Run initialization code
		if (behavior.init) {
    		behavior.init.call(this, args[behaviorName] || {});
		}
    }

    /**
     * Runs all of the objects tick functions, i.e. one iteration of the game loop.
	 *
	 * @param {GameState} gameState - Object defining the game's current state.
     */
    tick(gameState) {
    	this.ticks.forEach(tick => {
    		tick.call(this, gameState);
    	});
    }
}

module.exports = GameObject;
