
ObjectFactory.defineClass("Character", {
                          superClass:"GameObject",
                          behaviors:["Renderable", "Physical", "Solid", "Moving", "Platform", "FaceDirection", "Controllable"],
                          tick:function(gameState) {
                            var threshold = 0.1;
                            this.currentSprite = (Math.abs(this.hSpeed) > threshold) ? this.sprites.walk : this.sprites.stand;
                            if (!this.onGround) this.currentSprite = this.sprites.jump;
                          },
                          init:function(args) {
                            this.sprites = {stand: null, walk: null, jump: null};
                          }});

/**
A platform character object
*/
ObjectFactory.Character = function(args) {

	GameObject.call(this, args);
    

	//==============
	// Add behaviors
	//==============
    
    // Maybe something like this instead of overwriting the
    // tick function and manually calling the other ticks?
    this.addBehavior(function(gameState) {
                        var threshold = 0.1;
                        this.currentSprite = (Math.abs(this.hSpeed) > threshold) ? this.sprites.walk : this.sprites.stand;
                        if (!this.onGround) this.currentSprite = this.sprites.jump;
                     });
	this.addBehavior(Behavior.Renderable);
	this.addBehavior(Behavior.Physical);
	this.addBehavior(Behavior.Solid);
	this.addBehavior(Behavior.Moving);
	this.addBehavior(Behavior.Platform);
	this.addBehavior(Behavior.FaceDirection);
	this.addBehavior(Behavior.Controllable);


	//=================
	// Public interface
	//=================

	this.sprites = {stand: null, walk: null};

	/**
	Overwriting the tick object
	*/
    /*
	this.tick = function(gameState) {

		var threshold = 0.1;

		this.currentSprite = (Math.abs(this.hSpeed) > threshold) ? this.sprites.walk : this.sprites.stand;

		for (var i = 0; i < this.ticks.length; i++) {
			this.ticks[i].call(this, gameState);
		}
	};
     */
};

ObjectFactory.Character.prototype = new GameObject();


