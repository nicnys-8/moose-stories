/**
 * Container for storing game object behaviors.
 */

"use strict";

var Behaviors = {};

/**
* Stores a behavior.
* @param {string} behaviorName - The name that will be used when to access the behavior.
* @param {object} behavior - The object to store.
*/
function register(behaviorName, behavior) {
    if (behavior) {
        Behaviors[behaviorName] = behavior;
    } else {
        console.log("Trying to invalid behavior as "+ behaviorName);
    }
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
