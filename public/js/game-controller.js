"use strict";

/**
Returns a game controller object (controller of the MVC pattern)
@param gameState Object describing the entire gamestate (model of the MVC pattern)
@param canvas A HTML5 canvas (view of the MVC pattern)
@param camera A camera object used to render the game
@param keyboard An object for reacting to keyboard input
*/
module.exports = function(gameState, canvas, camera, keyboard) {

    var controlled = null,
        paused = false;


    //=================
    // Public Interface
    //=================

    this.gameState = gameState;
    this.camera = camera;
    this.keyboard = keyboard;

    /**
    Runs the main game loop
    @param ctx A 2D rendering context (view of the MVC pattern)
    //@TODO: Red ut varför hejn inte kan deklareras som this.tick
    */
    this.tick = function() {
        var ctx = canvas.getContext("2d"),
            renderList = this.gameState.filter("Renderable"),
			self = this,
            i;

        // Repeat the function before each frame is rendered:
        window.requestAnimationFrame(
            function() {
                self.tick();
            }
        );

        //===========
        // Game logic
        //===========

        this.keyboard.tick();
        if (paused) {
            return;
        }

        if (controlled) {
            if (this.keyboard.down("left")) {
                controlled.moveLeft();
            } else if (this.keyboard.down("right")) {
                controlled.moveRight();
            }
            if (this.keyboard.pressed("up")) {
                if (controlled.onGround) {
                    controlled.jump();
                }
            }
        }

        this.camera.tick();
        this.gameState.tick();

        //==========
        // Rendering
        //==========
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render all backgrounds
        for (i = 0; i < this.gameState.backgrounds.length; i++) {
            this.gameState.backgrounds[i].render(ctx);
        }

        ctx.save();

        ctx.translate(
            Math.round(-this.camera.x + (canvas.width / 2)),
            Math.round(-this.camera.y + (canvas.height / 2))
        );
        ctx.scale(this.camera.scale.x, this.camera.scale.y);
        ctx.rotate(this.camera.rotation);

        // Render in-game objects
        for (i = 0; i < renderList.length; i++) {
            renderList[i].render(ctx);
        }
        ctx.restore();
    };

    this.startGame = function() {
        // Start controlling a random guy...
        var controllable = this.gameState.filter("Controllable");
        this.setControlled(controllable[0]);
        // Play music
        if (this.gameState.music) this.gameState.music.play(); // hrmhrmhrm

        // Start the main game loop
        this.tick();
    };

    this.pause = function() {
        paused = true;
    };

    this.resume = function() {
        paused = false;
    };

    /**
    Sets which character is currently controlled by the player
    @param object A 'GameObject' instance with 'Controllable' behavior
    */
    this.setControlled = function(object) {
        // Stop the currently controlled character from moving
        if (controlled) {
            controlled.hAcceleration = 0;
            controlled.hSpeed = 0;
        }
        controlled = object;
        this.camera.target = controlled;
    };

};
