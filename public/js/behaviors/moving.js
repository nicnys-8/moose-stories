/**
 * Describes the behavior of a moving object.
 */

"use strict";

const Behaviors = require("./../behaviors");
const behavior = {};

let friction = 0.2; // TODO: Move to GameState? Or somewhere else?
let gravity = 0.3; // TODO: Move to GameState

behavior.dependencies = ["Physical"];

/**
 * Function that is called on an object when this behavior is added to it.
 */
behavior.init = function() {

	const maxSpeed = {x: 2.5, y: 9};

	this.acceleration = {x: 0, y: 0};
	this.speed        = {x: 0, y: 0};

	/**
	 * Applies a force on the object, affecting its horizontal acceleration.
	 *
	 * @param {number} force - The applied force, negative values for left, positive for right.
	 */
	this.applyForceX = function(force) {
		this.acceleration.x += force / this.weight;
	};

	/**
	 * Applies a force on the object, affecting its vertical acceleration.
	 *
	 * @param {number} force - The applied force, negative values for up, positive for down.
	 */
	this.applyForceY = function(force) {
		this.acceleration.y += force / this.weight;
	};

	/**
	 * Move the object a single step based on its current speed and the overall game state.
	 *
	 * @param {GameState} gameState - Object defining the game's current state.
	 */
	this.move = function(gameState) {
		const solids = gameState.filter("Solid");

		// TODO: Cram these silly loops into one
		// Move horizontally
		this.position.x += this.speed.x;
		for (let i = 0; i < solids.length; i++) {
			const solid = solids[i];
			if (this.overlapsObject(solid)) {
				// Don't check for collisions with itself
				if (solid === this) {
					continue;
				}
				const overlap = this.overlapsBy(solid, "x");

				if (overlap !== 0) {
					this.position.x = Math.round(this.position.x - overlap);
					this.speed.x = 0;
					break;
				}
			}
		}
		// Move vertically
		this.position.y += this.speed.y;
		for (let i = 0; i < solids.length; i++) {
			const solid = solids[i];
			if (this.overlapsObject(solid)) {
				// Don't check for collisions with itself
				if (solid === this) {
					continue;
				}
				const overlap = this.overlapsBy(solid, "y");

				if (overlap !== 0) {
					this.position.y = Math.round(this.position.y - overlap);
					this.speed.y = 0;
					break;
				}
			}
		}
	};

	/**
	 * Add function for updating the object.
	 *
	 * @param {GameState} gameState - Object defining the game's current state.
	 */
	this.onUpdate((gameState) => {

		this.speed.x += this.acceleration.x;
		this.speed.y += this.acceleration.y;

		// Limit horizontal and vertical speed
		this.speed.x = Math.max(Math.min(this.speed.x, maxSpeed.x), -maxSpeed.x);
		this.speed.y = Math.max(Math.min(this.speed.y, maxSpeed.y), -maxSpeed.y);

		this.move(gameState);

		// Friction and gravity
		if (Math.abs(this.speed.x) > friction) {
			this.acceleration.x = -Math.sign(this.speed.x) * friction;
		} else {
			this.acceleration.x = 0;
			this.speed.x = 0;
		}
		this.acceleration.y = gravity;
	});

};

Behaviors.register("Moving", behavior);
