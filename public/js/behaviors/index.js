/**
 * Container for storing game object behaviors.
 */

"use strict";

//================================
// Private functions and variables
//================================

var Behaviors = {};

/**
* Stores a behavior.
* @param {string} behaviorName - The name that will be used when to access the behavior.
* @param {object} behavior - The object to store.
*/
function register(behaviorName, behavior) {
    Behaviors[behaviorName] = behavior;
}

/**
* Returns the behavior registered with the specified name.
* @param {string} behaviorName - The name of the behavior to retrieve.
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
