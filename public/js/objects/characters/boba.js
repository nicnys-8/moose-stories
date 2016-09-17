
ObjectFactory.defineClass("Boba", {
                          superClass:"Character",
                          init:function(args) {
                            var hotspot = {x: 32, y: 32};
                          
                            this.boundingBox = {
                                left: -32, right: 32,
                                top: -32, bottom: 32
                            };
                          
                            this.sprites.stand = SpriteFactory.createSprite("img/sprites/boba/stand.svg", 1, hotspot);
                            this.sprites.walk = SpriteFactory.createSprite("img/sprites/boba/walk.svg", 2, hotspot);
                            this.sprites.jump = SpriteFactory.createSprite("img/sprites/boba/jump.svg", 1, hotspot);
                            this.sprites.walk.imageSpeed = 0.1;
                            this.currentSprite = this.sprites.stand;
                          }});

/**
A platform character object
*/
ObjectFactory.Boba = function(args) {

	ObjectFactory.Character.call(this, args);

    
	//================================
	// Private functions and variables
	//================================

	var hotspot = {x: 32, y: 32};


	//=================
	// Public interface
	//=================

	this.boundingBox = {
		left: -32, right: 32,
		top: -32, bottom: 32
	};

	this.sprites.stand = SpriteFactory.createSprite("img/sprites/boba/stand.svg", 1, hotspot);
	this.sprites.walk = SpriteFactory.createSprite("img/sprites/boba/walk.svg", 2, hotspot);
	this.sprites.jump = SpriteFactory.createSprite("img/sprites/boba/jump.svg", 1, hotspot);
	this.sprites.walk.imageSpeed = 0.1;
	this.currentSprite = this.sprites.stand;

}

ObjectFactory.Boba.prototype = new ObjectFactory.Character();


