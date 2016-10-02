"use strict";

var gameState = require("./game-state"),
    keyboard = require("./keyboard"),
    camera = require("./camera");

/**
 * @return {GameController} Controller in the MVC pattern sense of the word.
 */
function GameController() {

    var player = null,
        canvas = null,
        paused = false;

    /**
     * Runs the main game loop
     * Updates all in-game objects and renders the screen,
     * i.e. a single step in the main game loop.
     */
    this.tick = function() {
        var renderList = gameState.filter("Renderable"),
            self = this,
            ctx,
            i;

        if (!canvas) {
            console.warn("Set a canvas element using gameController.setCanvas.");
            return;
        }

        // Repeat the function before each frame is rendered:
        window.requestAnimationFrame(
            function() {
                self.tick();
            }
        );

        //===========
        // Game logic
        //===========

        keyboard.tick();
        if (paused) {
            return;
        }

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
        gameState.tick();

        //==========
        // Rendering
        //==========

        ctx = canvas.getContext("2d");
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render all backgrounds
        for (i = 0; i < gameState.getBackgrounds().length; i++) {
            gameState.getBackgrounds()[i].render(ctx);
        }

        ctx.save();

        ctx.translate(
            Math.round(-camera.x + (canvas.width / 2)),
            Math.round(-camera.y + (canvas.height / 2))
        );

        ctx.scale(camera.scale.x, camera.scale.y);
        ctx.rotate(camera.rotation);

        // Render in-game objects
        for (i = 0; i < renderList.length; i++) {
            renderList[i].render(ctx);
        }
        ctx.restore();
    };

    this.startGame = function() {
        // Start controlling a random guy...
        player = gameState.filter("Platform")[0];
        camera.target = player;
        // Play music
        if (gameState.getMusic()) {
            gameState.getMusic().play();
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
        paused = false;
    };

    /**
     * Sets the canvas used for rendering graphics.
     *
     * @param {HTMLCanvasElement} canvas - A HTML5 canvas element (view in the MVC pattern).
     */
    this.setCanvas = function(canvasArg) {
        canvas = canvasArg;
    };
}

module.exports = new GameController();
