/**
 * Describes an object that can be rendered on the screen
 */

"use strict";

const Behaviors = require("../../behaviors");

class Animator {

	/**
	 * Creates an animator behavior instance.
	 *
	 * @param {GameObject} gameObject    - The game object to which the behavior is applied.
	 */
	constructor(gameObject) {

		/**
		* The animation that is shown at any given moment.
		* @type {GameObject}
		*/
		this.currentAnimation = null;

		/**
		* Dictionary containing all animations.
		*/
		this.animations = {};

		/**
		 * Renders the object.
		 *
		 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
		 */
		gameObject.renderable.render = function(ctx) {
			if (this.currentAnimation) {
				this.currentAnimation.renderable.render(ctx, this.position, this.scale, this.rotation, this.alpha);
			}
		};

		/**
		 * @param  {number} [size] - Preferred height and width of the icon.
		 * @return {DOM Element} An icon representing the object.
		 */
		this.getIcon = function(size = 32) {
			const srcCanvas = this.currentAnimation.canvas;
			const icon = document.createElement("canvas");

			icon.width = srcCanvas.width;
			icon.height = srcCanvas.height;
			icon.getContext("2d").drawImage(srcCanvas, 0, 0);

			return icon;
		};

		/**
         * Update the behavior instance (one "tick" of the game loop).
         */
        this.update = function() {
			if (this.currentAnimation) {
				this.currentAnimation.tick();
			}
		};

	}
	
}

Animator.dependencies = ["Renderable", "HasIcon"];
Behaviors.register("Animator", Animator);
