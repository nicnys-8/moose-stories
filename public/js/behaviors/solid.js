/**
Describes the behavior of a solid object -
The object solidity can be turned on or off
with the function setSolid
 */
Behavior.Solid = Behavior.Solid || function() {

	//================================
	// Private functions and variables
	//================================

	var currentlySolid = true;

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

	behavior.name = "Solid";

	behavior.getProperties = function() {
		return {
			isSolid: isSolid,
			currentlySolid: currentlySolid
		};
	};

	return behavior;
}();
