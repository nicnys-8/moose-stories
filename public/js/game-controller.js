/**
 * An object that controls the game ('controller' in the MVC pattern).
 */

"use strict";

const GameState = require("./game-state");
const GameObject = require("./game-object");
const config = require("./config");

/**
 * Instantiates a game controller object.
 *
 * @constructor
 * @this {GameController}
 */
function GameController() {

	const camera = new GameObject("Camera");
	const keyboard = new GameObject("Keyboard");

	let shouldDrawGrid = false;
	let player = null;
	let canvas = null;
	let paused = false;

	/**
	 * Renders the current view of the game.
	 */
	this.render = function() {

		const renderList = GameState.filter("Renderable");
		const offsetX = -camera.position.x + (canvas.width / 2);
		const offsetY = -camera.position.y + (canvas.height / 2);

		let ctx = canvas.getContext("2d");
		let	background;

		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.save();
		if (camera.scale.x !== 1 || camera.scale.y !== 1) {
			ctx.scale(camera.scale.x, camera.scale.y);
		}
		if (camera.rotation !== 0) {
			ctx.rotate(camera.rotation);
		}

		background = GameState.getBackground();
		if (background !== null) {
			background.render(ctx, offsetX, offsetY);
		}

		// Render in-game objects
		ctx.translate(offsetX, offsetY);
		for (let i = 0; i < renderList.length; i++) {
			renderList[i].render(ctx);
		}
		ctx.restore();

		// Optionally render a grid
		if (shouldDrawGrid) {
			ctx.save();
			ctx.globalAlpha = 0.15;

			let i = offsetX % config.tileSize + config.tileSize / 2;
			for (i; i < canvas.width; i += config.tileSize) {
				ctx.beginPath();
				ctx.moveTo(i, 0);
				ctx.lineTo(i, canvas.height);
				ctx.stroke();
			}

			i = offsetY % config.tileSize + config.tileSize / 2;
			for (i; i < canvas.height; i += config.tileSize) {
				ctx.beginPath();
				ctx.moveTo(0, i);
				ctx.lineTo(canvas.width, i);
				ctx.stroke();
			}
			ctx.restore();
		}
	};

	/**
	 * Runs the main game loop
	 * Updates all in-game objects and renders the screen,
	 * i.e. a single step in the main game loop.
	 */
	this.tick = function() {
		if (!canvas) {
			console.warn("Set a canvas element using gameController.setCanvas.");
			return;
		}

		// Repeat the function before each frame is rendered:
		window.requestAnimationFrame(() => {
			this.tick();
		});

		keyboard.tick();
		if (paused) {
			return;
		}

		this.render();

		if (keyboard.down("left")) {
			player.moveLeft();
		} else if (keyboard.down("right")) {
			player.moveRight();
		}
		if (keyboard.pressed("up")) {
			player.jump();
		}
		if (keyboard.released("up")) {
			player.cancelJump();
		}

		camera.tick();
		GameState.tick();
	};

	this.startGame = function() {
		player = GameState.filter("Player")[0];
		camera.target = player;
		if (GameState.getMusic()) {
			GameState.getMusic().play();
		}
		// Start the main game loop
		this.tick();
	};

	/**
	 * Pauses the game loop.
	 */
	this.pause = function() {
		paused = true;
	};

	/**
	 * Resumes the game loop.
	 */
	this.resume = function() {
		player = GameState.filter("Player")[0];
		camera.target = player;
		paused = false;
	};

	/**
	 * Resets the current level.
	 */
	this.resetLevel = function() {
		GameState.clear();
		this.startGame();
	};

	/**
	 * Sets the canvas used for rendering graphics.
	 *
	 * @param {HTMLCanvasElement} canvas - A HTML5 canvas element (view in the MVC pattern).
	 */
	this.setCanvas = function(canvasArg) {
		canvas = canvasArg;
	};

	/**
	 * @return {Camera} The camera object.
	 */
	this.getCamera = function() {
		return camera;
	};

	/**
	 * Sets the position of the camera.
	 * @param {number} x - Horizontal coordinate
	 * @param {number} y - Vertical coordinate
	 */
	this.setCameraPosition = function(x, y) {
		camera.position.x = x;
		camera.position.y = y;
	};

	/**
	 * Makes the controller draw a grid overlay when rendering the game.
	 * @param {boolean} bool - True if the grid should be drawn, false otherwise.
	 */
	this.drawGrid = function(bool) {
		shouldDrawGrid = bool;
	};
}

module.exports = new GameController();
