/**
 * Container for storing game object behaviors.
 */

"use strict";

const Behaviors = {};

/**
 * Stores a behavior.
 *
 * @param {string} behaviorName - he name that will be used when to access the behavior.
 * @param {object} behavior     - The behavior object to store.
 */
function register(behaviorName, behavior) {
	if (behavior) {
		Behaviors[behaviorName] = behavior;
	} else {
		console.log("Trying to add invalid behavior as " + behaviorName);
	}
}

/**
 * Returns the behavior registered with the specified name.
 *
 * @param {string} behaviorName - The name of the behavior to retrieve.
 * @return {object} The registered behavior.
 */
function get(behaviorName) {
	return Behaviors[behaviorName] || null;
}


//=================
// Public interface
//=================

module.exports = {
	register: register,
	get: get
};
