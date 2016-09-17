/**
Describes the behavior of a moving object
*/
Behavior.Moving = Behavior.Moving || function() {

	//================================
	// Private functions and variables
	//================================

	function moveCarried(deltaX, gameState) {
		carried = this.carriedObjects(gameState);

		// Sort by horizontal position
		carried.sort(function(a, b){
			return (deltaX > 0) ? (a.x - b.x) : (b.x - a.x)
		});

		for (var i = 0; i < carried.length; i++) {
			carried[i].tryHorizontalMove(deltaX, gameState);
		}
	}

	function dragCarried(deltaY, gameState) {
		carried = this.carriedObjects(gameState);
		for (var i = 0; i < carried.length; i++) {
			carried[i].tryVerticalMove(deltaY, gameState);
		}
	}

	/**
	Returns true if the object is standing firmly on the other one
	(which means it won't fall off if the other one moves)
	*/
	function carriedBy(obj) {
		return (!(this.x >= obj.x + obj.boundingBox.right ||
			this.x <= obj.x + obj.boundingBox.left) &&
		this.y + this.boundingBox.bottom === obj.y + obj.boundingBox.top);
	}

	/**
	Returns an array of all objects (with Moving behavior) carried by this
	*/
	function carriedObjects(gameState) {
		var result = [];
		var obj;
		var moving = gameState.filter("Moving");

		for (var i = 0; i < moving.length; i++) {
			obj = moving[i];

			// ignore self...
			if (obj === this) {
				continue;
			}

			// If the object is on top of this...
			if (!(obj.x + obj.boundingBox.left > this.x + this.boundingBox.right || obj.x + obj.boundingBox.right < this.x + this.boundingBox.left)
				&&
				obj.y + obj.boundingBox.bottom === this.y + this.boundingBox.top
				) {
				// ... add it to the list
			result.push(obj);
				// Recursvie call:
				//result = result.concat(obj.carriedObjects(gameState));
			}
		}
		return result;
	}

	/**
	Calculates how far the object can along a given path,
	and which objects it would need to push to do so
	@param deltaY The vertical distance to examine
	@param gameState An object describing the entire game state
	*/
	function freeVDistance(deltaY, gameState) {

		var solid = gameState.filter("Solid");
		var pushed = [];
		var distance = deltaY;
		var compare = (deltaY > 0) ? Math.min : Math.max;
		var obj;
		var pushDistance;
		var recursiveResult;
		var contactDistance;
		var i;

		// Check for collisions with each solid object
		for (i = 0; i < solid.length; i++) {
			obj = solid[i];

			// Ignore collisions with itself
			if (this === obj) {
				continue;
			}

			if (this.overlapsAtOffset(obj, 0, distance)) {

				// Calculate the distance to the other object
				contactDistance = -this.verticalOverlap(obj);

				// If moving upward, check if the obstacle can be pushed
				if (obj.hasBehavior("Moving") && deltaY < 0) {

					pushDistance = distance - contactDistance; // The distance we are trying to push the other object
					recursiveResult = obj.freeVDistance(pushDistance, gameState);

					// Set the distance to be at most the distance to the other object, plus however far it can be pushed
					distance = compare(distance, contactDistance + recursiveResult.distance);
					
					// Add the object, and all objects it will push in turn, to the list of pushed objects
					pushed.push(obj);
					pushed = pushed.concat(recursiveResult.pushed);

				} else {
					// If the object couldn't be pushed, stop
					distance = compare(distance, contactDistance);
				}
			}
		}
		return {distance: distance, pushed: pushed};
	}

	/**
	Calculates how far the object can along a given path,
	and which objects it would need to push to do so
	@param deltaY The horizontal distance to examine
	@param gameState An object describing the entire game state
	*/
	function freeHDistance(deltaX, gameState) {
		var solid = gameState.filter("Solid");
		var pushed = [];
		var distance = deltaX;
		var compare = (deltaX > 0) ? Math.min : Math.max;
		var obj;
		var pushDistance;
		var recursiveResult;
		var contactDistance;
		var i;

		// Check for collisions with each solid object
		for (i = 0; i < solid.length; i++) {
			obj = solid[i];

			// Ignore collisions with itself
			if (this === obj) {
				continue;
			}

			if (this.overlapsAtOffset(obj, distance, 0)) {

				// Calculate the distance to the other object
				contactDistance = -this.horizontalOverlap(obj);

				// Check if the obstacle can be pushed
				if (obj.hasBehavior("Moving")) {
					pushDistance = distance - contactDistance; // The distance we are trying to push the other object
					recursiveResult = obj.freeHDistance(pushDistance, gameState);

					// Set the distance to be at most the distance to the other object, plus however far it can be pushed
					distance = compare(distance, contactDistance + recursiveResult.distance);

					// Add the object, and all objects it will push in turn, to the list of pushed objects
					pushed.push(obj);
					pushed = pushed.concat(recursiveResult.pushed);

				} else {
					// If the object couldn't be pushed, stop
					distance = compare(distance, contactDistance);
				}
			}
		}
		return {distance: distance, pushed: pushed};
	}

	/**
	Attempt to move the object horizontally
	@param deltaX The distance to travel
	@param gameState Object describing the entire game state
	*/
	function tryHorizontalMove(deltaX, gameState) {
		var moveData = this.freeHDistance(deltaX, gameState);
		var distance = moveData.distance;
		var pushed = moveData.pushed;

		if (Math.abs(distance) < Math.abs(deltaX)) {
			this.hSpeed = 0;
		}

		distance = Math.round(distance);

		// Push any obstacles
		for (var i = 0; i < pushed.length; i++) {
			//pushed[i].x += distance;
			pushed[i].tryHorizontalMove(distance, gameState);
		}

		this.moveCarried(distance, gameState);
		this.x += distance;
	}

	/**
	Attempt to move the object vertically
	@param deltaY The distance to travel
	@param gameState Object describing the entire game state
	*/
	function tryVerticalMove(deltaY, gameState) {
		var moveData = this.freeVDistance(deltaY, gameState);
		var pushed = moveData.pushed;
		var distance = moveData.distance;		

		if (Math.abs(distance) < Math.abs(deltaY)) {
			this.vSpeed = 0;
		}

		distance = Math.round(distance);

		// Push any obstacles
		this.dragCarried(distance, gameState);
		this.y += distance;
	}

	/**
	Attempt to move the object
	@param deltaX The horizontal distance to travel
	@param deltaX The vertical distance to travel
	@param gameState Object describing the entire game state
	*/
	function move(deltaX, deltaY, gameState) {
		var threshold = 0.1; //@TODO: Flytta ut det här nånstans vettigt
		if (Math.abs(deltaY) > threshold) {
			this.tryVerticalMove(deltaY, gameState);
		}
		if (Math.abs(deltaX) > threshold) {
			this.tryHorizontalMove(deltaX, gameState);
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
			vAcceleration: 0.4,
			hSpeed: 0,
			vSpeed: 0,
			maxHSpeed: 2,
			maxVSpeed: 7,

			// Functions
			move: move,
			tryHorizontalMove: tryHorizontalMove,
			tryVerticalMove: tryVerticalMove,
			freeHDistance: freeHDistance,
			freeVDistance: freeVDistance,
			carriedObjects: carriedObjects,
			carriedBy: carriedBy,
			moveCarried: moveCarried,
			dragCarried: dragCarried
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
