/**
Describes the behavior of a moving object
*/
Behavior.Moving = Behavior.Moving || function() {
	
	//================================
	// Private functions and variables
	//================================
	
	function objectsToMove(gameState, deltaX, deltaY) {
		var objects = gameState.objectsInZone(
			Math.min(this.x + this.boundingBox.left  , this.x + this.boundingBox.left   + deltaX),
			Math.max(this.x + this.boundingBox.right , this.x + this.boundingBox.right  + deltaX),
			Math.min(this.y + this.boundingBox.top   , this.y + this.boundingBox.top    + deltaY),
			Math.max(this.y + this.boundingBox.bottom, this.y + this.boundingBox.bottom + deltaY)
		);

		return objects;
	}

	function computeWeight(gameState) {
		var carried = this.carriedObjects(gameState);
		var weight = this.weight;
		for (var i = 0; i < carried.length; i++) {
			weight += carried[i].computeWeight(gameState);
		}
		return weight;
	}
	
	/**
	 * Returns the moving objects directly on top of this object, i.e objects carried by this.
	 *	(This function is not recursive, so it only returns the
	 *	objects standing directly on the target)
	 *	
	 * @return {[GameObjects]} Carried objects.
	 */
	function carriedObjects(gameState) {
		var objects = gameState.objectsInZone(
			this.x + this.boundingBox.left,
			this.x + this.boundingBox.right,
			this.y + this.boundingBox.top - 1,
			this.y + this.boundingBox.bottom
		);
		var carried = [];
		for (var i = 0; i < objects.length; i++) {
			obj = objects[i];
			if (obj.hasBehavior("Moving") && obj.onTopOf(this)) {
				carried.push(obj);
			}
		}
		return carried;
	}
	
	/**
	Attempt to move the object
	@param deltaX The horizontal distance to travel
	@param deltaX The vertical distance to travel
	@param gameState Object describing the entire game state
	*/
	function move(deltaX, deltaY, gameState) {
		/*
		var totalWeight = this.computeWeight(gameState);
		var modifier = (this.strength - totalWeight) / this.strength;
		console.log(modifier);
		deltaX *= modifier;
		deltaY *= modifier;
		*/
		var threshold = 0.1; //@TODO: Flytta ut det här nånstans vettigt
		if (Math.abs(deltaY) > threshold) {
			if ( this.canMove(deltaY, "y", gameState) ) {
				this.tryMove(deltaY, "y", gameState);
			}
		}
		if (Math.abs(deltaX) > threshold) {
			if ( this.canMove(deltaX, "x", gameState) ) {
				this.tryMove(deltaX, "x", gameState);
			}
		}
	}

	function canMove( delta, coordinate, gameState )
	{
		var deltaX;
		var deltaY;
		var speedVar;
		
		// Set up coordinate dependent variables and variable names
		switch (coordinate) {
			case "x":
				deltaX = delta;
				deltaY = 0;
				speedVar = "hSpeed";
				break;
			case "y":
				deltaX = 0;
				deltaY = delta;
				speedVar = "vSpeed";
				break;
			default:
				throw new Error("Not a valid coordinate.");
				break;
		}

		// Find all objects within the area that will be traversed
		var objects = this.objectsToMove(gameState, deltaX, deltaY);

		var direction = delta ? delta < 0 ? -1 : 1 : 0; // Calculate the direction of delta
		var staticObjects = gameState.filter("Moving", "exclude", objects); //@TODO: Only solids though, right?
		var prev = this[coordinate];

		// Test moving the object
		this[coordinate] = Math.round(this[coordinate] + delta);
		for (var i = 0; i < staticObjects.length; i++) {
			
			var currentObject = staticObjects[i];
			if ( this.overlapsObject(currentObject) ) {
				var overlap = this.overlapsBy(currentObject, coordinate);
				if ( Math.abs(overlap) >= delta ) {
					// Can't move the object.
					// Restore state and return.
					this[coordinate] = prev;
					return false;
				}
			}
		}
		this[coordinate] = prev;
		// Object could be moved.

		// Recursively check all carried objects
		// Only needed if we are travelling in y direction...
		if (coordinate === "y")
		{
			var carried = this.carriedObjects(gameState);
			for (var i = 0; i < carried.length; i++) {
				
				var obj = carried[i];
				if ( !obj.canMove( delta, coordinate, gameState ) ) {
					return false;
				}
			}
		}

		return true;
	}
	
	/**
	Attemt to move object in a specified direction.
	@param delta The distance to travel
	@param coordinate The coordinate along which to move
	@param gameState Object describing the game
	*/
	function tryMove(delta, coordinate, gameState) {
		var deltaX;
		var deltaY;
		var speedVar;
		
		// Set up coordinate dependent variables and variable names
		switch (coordinate) {
			case "x":
				deltaX = delta;
				deltaY = 0;
				speedVar = "hSpeed";
				break;
			case "y":
				deltaX = 0;
				deltaY = delta;
				speedVar = "vSpeed";
				break;
			default:
				throw new Error("Not a valid coordinate.");
				break;
		}
		
		// Find all objects within the area that will be traversed
		var objects = this.objectsToMove(gameState, deltaX, deltaY);
		
		var carried = this.carriedObjects(gameState);
		var direction = delta ? delta < 0 ? -1 : 1 : 0; // Calculate the direction of delta
		var prev = this[coordinate];
		var totalWeight = this.computeWeight(gameState);
		var obj;
		var steps;
		var pushDistance;
		
		// Move the object
		this[coordinate] = Math.round(this[coordinate] + delta);
		
		// Check for collisions
		for (var i = 0; i < objects.length; i++) {
			obj = objects[i];
			// Ignore collisions with itself
			if (this === obj) {
				continue;
			}
			
			if (this.overlapsObject(obj)) {
				// Try pushing the obstacle
				pushDistance = this.overlapsBy(obj, coordinate);
				if (obj.hasBehavior("Moving") && (coordinate !== "y" || deltaY < 0)) {
					obj.tryMove(pushDistance, coordinate, gameState);
				} else {
					// If the obstacle can't be pushed, stop moving
					this[speedVar] = 0;
				}
				
				// Move back until there is no overlap
				while (this.overlapsObject(obj)) {
					this[coordinate] -= direction;
				}

				/* (Another piece of ugliness...
				vSpeed must be set to zero if the object hits a ceiling or something...)
				*/
				if (coordinate === "y" && this[coordinate] === prev) this.vSpeed = 0;
			}
		}
		
		// Move carried objects or drag carried objects down
		pushDistance = this[coordinate] - prev;
		if (coordinate !== "y" || deltaY > 0) {
			for (var i = 0; i < carried.length; i++) {
				obj = carried[i];
				obj.hasBeenCarriedThisTick = true;
				obj.tryMove(pushDistance, coordinate, gameState);
			}
		}
	}
	
	//=================
	// Public interface
	//=================
	
	var behavior = {};
	
	behavior.name = "Moving";
	
	behavior.getProperties = function() {
		return {
			// Variables
			hAcceleration: 0,
			vAcceleration: 0.3,
			hSpeed: 0,
			vSpeed: 0,
			maxHSpeed: 2,
			maxVSpeed: 7,
			strength: 3,
			
			// Functions
			move: move,
			canMove: canMove,
			tryMove: tryMove,
			carriedObjects: carriedObjects,
			computeWeight: computeWeight,
			objectsToMove: objectsToMove
		};
	};
	
	behavior.tick = function(gameState) {
		var obj, solidObjects;
		
		this.hSpeed += this.hAcceleration;
		this.vSpeed += this.vAcceleration;
		
		// Limit vSpeed to maxVSpeed in either direction
		this.vSpeed = Math.max(Math.min(this.vSpeed, this.maxVSpeed), -this.maxVSpeed);
		// Limit hSpeed to maxHSpeed in either direction
		this.hSpeed = Math.max(Math.min(this.hSpeed, this.maxHSpeed), -this.maxHSpeed);
		
		this.move(this.hSpeed, this.vSpeed, gameState);
	};
	
	return behavior;
}();
