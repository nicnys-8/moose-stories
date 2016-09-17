
ObjectFactory.defineClass("Niri", {
                          superClass:"Character",
                          init:function(args) {
                            var hotspot = {x: 32, y: 16};
                          
                            this.boundingBox = {
                                left: -32, right: 32,
                                top: -16, bottom: 16
                            };
                    
                            this.sprites.stand = SpriteFactory.createSprite("img/sprites/niri/stand.svg", 1, hotspot);
                            this.sprites.walk = SpriteFactory.createSprite("img/sprites/niri/walk.svg", 2, hotspot);
                            this.sprites.jump = SpriteFactory.createSprite("img/sprites/niri/jump.svg", 1, hotspot);
                            this.sprites.walk.imageSpeed = 0.1;
                            this.currentSprite = this.sprites.stand;
                          }});

/**
Returns a platform character object
*/
ObjectFactory.Niri = function(args) {

	ObjectFactory.Character.call(this, args);


	//================================
	// Private functions and variables
	//================================

	var hotspot = {x: 32, y: 16};


	//=================
	// Public interface
	//=================
	
	this.boundingBox = {
		left: -32, right: 32,
		top: -16, bottom: 16
	};

	this.sprites.stand = SpriteFactory.createSprite("img/sprites/niri/stand.svg", 1, hotspot);
	this.sprites.walk = SpriteFactory.createSprite("img/sprites/niri/walk.svg", 2, hotspot);
	this.sprites.jump = SpriteFactory.createSprite("img/sprites/niri/jump.svg", 1, hotspot);
	this.sprites.walk.imageSpeed = 0.1;
	this.currentSprite = this.sprites.stand;

};

ObjectFactory.Niri.prototype = new ObjectFactory.Character();

