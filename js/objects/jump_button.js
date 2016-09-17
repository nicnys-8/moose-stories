
ObjectFactory.defineClass("JumpButton", {
                          superClass:"GameObject",
                          behaviors:["Renderable", "Physical", "Solid"],
                          init:function(args, defaults) {
                          
                            var self = this;
                            // A list of functions to execute when the button is toggled
                            var callbacks = [];
                          
                            var hotspotA = {x: 16, y: 16};
                            var hotspotB = {x: 16, y: 16};
                            var standardSprite = SpriteFactory.createSprite("img/sprites/button.svg", 1, hotspotA);
                            var pushedSprite = SpriteFactory.createSprite("img/sprites/button_pushed.svg", 1, hotspotB);
                          
                            var smallBBox = {
                                left: -16, right: 16,
                                top: -16, bottom: 0
                            };
                          
                            //=================
                            // Public interface
                            //=================
                          
                            /**
                             Specifies a function to be executed when the button is toggled
                             @param func The function to call
                             */
                            this.addCallback = function(func) {
                                callbacks.push(func);
                            }
                          
                            /**
                             Toggles between on and off and alerts all listeners
                             */
                            this.toggle = function() {
                                this.isPushed = !this.isPushed;
                          
                                for (var i = 0; i < callbacks.length; i++) {
                                    callbacks[i](this.isPushed);
                                }
                            }
                          
                            /**
                             Switches the button from on to off and alerts all listeners
                             */
                            this.press = function() {
                                if (!this.isPushed) {
                                    this.toggle();
                                }
                            }
                          
                            /**
                             Switches the button from off to on and alerts all listeners
                             */
                            this.release = function() {
                                if (this.isPushed) {
                                    this.toggle();
                                }
                            }
                          
                            /**
                             Checks whether this is currently being pushed by another object
                             (funkar inte så bra för tillfället)
                             @param obj The object to check
                             */
                            this.pushedBy = function(obj) {
                                return (
                                        !(
                                          this.x + this.boundingBox.right < obj.x + obj.boundingBox.left ||
                                          this.x + this.boundingBox.left > obj.x + obj.boundingBox.right) &&
                                        this.y + this.boundingBox.bottom === obj.y + obj.boundingBox.top
                                        );
                            }
                          
                            this.currentSprite = standardSprite;
                          
                            this.boundingBox = {
                                left: -16, right: 16,
                                top: -16, bottom: 16
                            };
                          
                            this.addCallback(function(a) {
                                             self.currentSprite = pushedSprite;
                                             self.boundingBox = smallBBox;
                                             });
                          },
                          tick: function(gameState) {
                            var moving = gameState.filter("Moving");
                          
                            // Check if any object is pushing this one
                            for (var i = 0; i < moving.length; i++) {
                                if (this.pushedBy(moving[i])) {
                                    this.press();
                                }
                            }
                          }});
/**
Returns a solid block object
*/
ObjectFactory.JumpButton = function(params) {

	GameObject.call(this, params);
	

	//================================
	// Private functions and variables
	//================================

	var self = this;

	/**
	A list of functions to execute when the button is toggled
	*/
	var callbacks = [];

	var hotspotA = {x: 16, y: 16};
	var hotspotB = {x: 16, y: 16};
	var standardSprite = SpriteFactory.createSprite("img/sprites/button.svg", 1, hotspotA);
	var pushedSprite = SpriteFactory.createSprite("img/sprites/button_pushed.svg", 1, hotspotB);

	var smallBBox = {
		left: -16, right: 16,
		top: -16, bottom: 0
	};


	//==============
	// Add behaviors
	//==============

	this.addBehavior(Behavior.Renderable);
	this.addBehavior(Behavior.Physical);
	this.addBehavior(Behavior.Solid);


	//=================
	// Public interface
	//=================

	/**
	Specifies a function to be executed when the button is toggled
	@param func The function to call
	*/
	this.addCallback = function(func) {
		callbacks.push(func);
	}

	/**
	Toggles between on and off and alerts all listeners
	*/
	this.toggle = function() {
		this.isPushed = !this.isPushed;

		for (var i = 0; i < callbacks.length; i++) {
			callbacks[i](this.isPushed);
		}
	}

	/**
	Switches the button from on to off and alerts all listeners
	*/
	this.press = function() {
		if (!this.isPushed) {
			this.toggle();
		}
	}

	/**
	Switches the button from off to on and alerts all listeners
	*/
	this.release = function() {
		if (this.isPushed) {
			this.toggle();
		}
	}

	/**
	Checks whether this is currently being pushed by another object
	(funkar inte så bra för tillfället)
	@param obj The object to check
	*/
	this.pushedBy = function(obj) {
		return (
			!(
				this.x + this.boundingBox.right < obj.x + obj.boundingBox.left ||
				this.x + this.boundingBox.left > obj.x + obj.boundingBox.right) &&
			this.y + this.boundingBox.bottom === obj.y + obj.boundingBox.top
		);
	}	

	/**
	Overwriting the tick object
	*/
	this.tick = function(gameState) {
		var moving = gameState.filter("Moving");
		var obj;

		// Check if any object is pushing this one
		for (var i = 0; i < moving.length; i++) {
			if (this.pushedBy(moving[i])) {
				this.press();
			}
		}

		for (var i = 0; i < this.ticks.length; i++) {
			this.ticks[i].call(this, gameState);
		}
	};

	this.currentSprite = standardSprite;

	this.boundingBox = {
		left: -16, right: 16,
		top: -16, bottom: 16
	};

	this.addCallback(function(a) {
		self.currentSprite = pushedSprite;
		self.boundingBox = smallBBox;
	});
}

ObjectFactory.JumpButton.prototype = new GameObject();

