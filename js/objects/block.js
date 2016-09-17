
ObjectFactory.defineClass("Block", {
                          superClass:"GameObject",
                          behaviors:["Renderable", "Physical", "Solid"],
                          defaults:{width:32, height:32},
                          init:function(args, defaults) {
                            var width = args.width,
                                height = args.height,
                                hotspot = {x: width / 2, y: height / 2};

                            this.currentSprite = SpriteFactory.createSprite("img/sprites/block.svg", 1, hotspot);
                          
                            this.scale.x = width / defaults.width;
                            this.scale.y = height / defaults.height;
                          
                            this.boundingBox = {
                                left: -width / 2, right: width / 2,
                                top: -height / 2, bottom: height/ 2
                            };
                          }});

/**
A solid block object
 params = {
    width : Number,
    height : Number
 }
 */
ObjectFactory.Block = function(args) {

	GameObject.call(this, args);

	
	//================================
	// Private functions and variables
	//================================

	var standardWidth = 32, standardHeight = 32;

    var width = +params.width || standardWidth;
    var height = +params.height || standardHeight;
    
    /*
	// Set values for width and height
	if (typeof(width) === "undefined") {
		width = standardWidth;
	}
	if (typeof(height) === "undefined") {
		height = standardHeight;
	}
     */
    
	var hotspot = {x: width / 2, y: height / 2};
	

	//==============
	// Add behaviors
	//==============
	
	this.addBehavior(Behavior.Renderable);
	this.addBehavior(Behavior.Physical);
	this.addBehavior(Behavior.Solid);


	//=================
	// Public interface
	//=================

	this.currentSprite = SpriteFactory.createSprite("img/sprites/block.svg", 1, hotspot);

	this.scale.x = width / standardWidth;
	this.scale.y = height / standardHeight;

	this.boundingBox = {
		left: -width / 2, right: width / 2,
		top: -height / 2, bottom: height/ 2
	};
}

ObjectFactory.Block.prototype = new GameObject();

