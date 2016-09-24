/**
 * Describes the behavior of a solid object -
 * The object solidity can be turned on or off
 * with the function setSolid
 */

"use strict";

var Behaviors = require("./../behaviors"),
    currentlySolid = true;

/**
Returns whether or not the object is currently solid
*/
function isSolid() {
    return currentlySolid;
}

/**
Sets the solidity of the object
*/
function setSolid(bool) {
    currentlySolid = bool;
}

//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Physical"];

behavior.getProperties = function() {
    return {
        isSolid: isSolid,
    };
};

Behaviors.register("Solid", behavior);
