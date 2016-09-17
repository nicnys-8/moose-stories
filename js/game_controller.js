/**
Returns a game controller object (controller of the MVC pattern)
@param gameState Object describing the entire gamestate (model of the MVC pattern)
@param canvas A HTML5 canvas (view of the MVC pattern)
@param camera A camera object used to render the game
@param keyboard An object for reacting to keyboard input
*/
function GameController(gameState, canvas, camera, keyboard) {

	//================================
	// Private functions and variables
	//================================

	var controllable;
	var controlled = null;

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
		var ctx = canvas.getContext("2d");
		var self = this;

		// Repeat the function before each frame is rendered:
		window.requestAnimationFrame(
			function() {
				self.tick();
			}
			);

		var renderList = this.gameState.filter("Renderable");
		var i;

		//================
		// Move all this...
		//=================
		if (this.keyboard.down("left")) {
			controlled.hAcceleration = -0.5; // Cursed number!
		} else if (this.keyboard.down("right")) {
			controlled.hAcceleration = 0.5; // Magic!!
		} else {
			controlled.hAcceleration = -controlled.hSpeed / 5; // GAAH?!
		}

		if (this.keyboard.pressed("up")) {
			if (controlled.onGround) {
				controlled.jump();
			}
		}

		if (this.keyboard.pressed("z")) {
			this.setControlled(this.gameState.getObjectByUID(0));
			//this.controlPrevious();
		}

		if (this.keyboard.pressed("x")) {
			this.setControlled(this.gameState.getObjectByUID(1));
			//this.controlNext();
		}

		if (this.keyboard.pressed("c")) {
			this.setControlled(this.gameState.getObjectByUID(2));
			//this.controlPrevious();
		}

		if (this.keyboard.pressed("v")) {
			this.setControlled(this.gameState.getObjectByUID(3));
			//this.controlPrevious();
		}

		//===================
		// ... somewhere else
		//===================

		//===========
		// Game logic
		//===========

		this.camera.tick();
		this.keyboard.tick();
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
	}

	this.startGame = function() {
		// Start controlling a random guy... 
		controllable = this.gameState.filter("Controllable");
		this.setControlled(controllable[0]);
		// Play music
		if (this.gameState.music) this.gameState.music.play(); // hrmhrmhrm
		// Start the main game loop
		this.tick();
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

	/**
	Switches the controlled character to the next one in the list
	*/
	this.controlNext = function() {
		var index = controllable.indexOf(controlled);
		index = (index + 1) % controllable.length;
		this.setControlled(controllable[index]);
	};

	/**
	Switches the controlled character to the previous one in the list
	*/
	this.controlPrevious = function() {
		var index = controllable.indexOf(controlled);
		index = (controllable.length + (index - 1) % controllable.length) % controllable.length;
		this.setControlled(controllable[index]);
	};
}
