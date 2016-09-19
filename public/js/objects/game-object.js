

// Just den här biten kanske inte blev så klockren..?
ObjectFactory.defineBaseClass("GameObject", GameObject);

/*
ObjectFactory.defineBaseClass("GameObject",
                              {
                              defaults:{x:0, y:0, uid:null},
                              init: function(args, defaults) {
                                this.behaviors = {}; // [];
                                this.ticks = [];
                                this.uid = args.uid; // This is set in GameState, when the level is parsed
                                this.x = args.x;
                                this.y = args.y;
                              },
                              prototype: {
                                setNumber: function(name, args, defaultValue) {
                                    var value = (args && +args[name]);
                                    if (!value && value !== 0) {
                                        value = defaultValue;
                                    }
                                    this[name] = value;
                                },
                                setString: function(name, args, defaultValue) {
                                    this[name] = ("" + args[name]) || defaultValue;
                                },
 
                                hasBehavior: function(behavior) {
                                    return !!this.behaviors[behavior];
                                },
                              
                                addBehavior: function(behavior) {
                              
                                    if (typeof behavior === "function") {
                                    // Subclasses can add custom behavior with functions
                                        this.ticks.push(behavior);
                                        return;
                                    }
                              
                                    // Check if the behavior has already been added
                                    if (this.hasBehavior(behavior.name)) {
                                        console.trace("Trying to add behavior " + behavior.name + "again...");
                                        return;
                                    }
                              
                                    // Add the name of the behavior
                                    this.behaviors[behavior.name] = true; // .push(behavior.name);
                              
                                    // Add behavior dependencies first!
                                    if (behavior.dependencies) {
                                        for (var i in behavior.dependencies) {
                                            this.addBehavior(Behavior[i]);
                                        }
                                    }
                              
                                    var properties = behavior.getProperties();
                              
                                    // Add all behavior properties
                                    for (var p in properties) {
                                        // Don't overwrite already existing properties
                                        if (!this.hasOwnProperty(p)) {
                                            this[p] = properties[p];
                                        }
                                    }
                              
                                    // Modify the target's tick function
                                    if (behavior.tick) {
                                        this.ticks.push(behavior.tick);
                                    }
                                },
                              
                                tick: function(gameState) {
                                    for (var i = 0; i < this.ticks.length; i++) {
                                        this.ticks[i].call(this, gameState);
                                    }
                                },
                              }});
*/


/**
An in-game object
*/
function GameObject(args, defaults) {
    /*
     GameObject.call(this, args, this.merge({
                                             width:13,
                                             height:13
                                             },
                                            defaults
                                            ));
     */
    //===================
	// Instance variables
	//===================

	this.behaviors = {}; // [];
	this.ticks = [];
	this.uid = args && args.uid; // This is set in GameState, when the level is parsed
    this.setNumber("x", args, 0);
    this.setNumber("y", args, 0);
};

GameObject.prototype.setNumber = function(name, args, defaultValue) {
    var value = (args && +args[name]);
    if (!value && value !== 0) {
        value = defaultValue;
    }
    this[name] = value;
};

GameObject.prototype.setString = function(name, args, defaultValue) {
    this[name] = ("" + args[name]) || defaultValue;
};

//=================
// Public functions
//=================

/**
Returns true if the object has the given behavior, false otherwise
*/
GameObject.prototype.hasBehavior = function(behavior) {
    return !!this.behaviors[behavior];
    /*
	for (var i = 0; i < this.behaviors.length; i++) {
		if (behavior === this.behaviors[i]) {
			return true;
		}
	}
	return false;
     */
};

/**
Adds a behavior to the sprite object
*/
GameObject.prototype.addBehavior = function(behavior) {
    
    if (typeof behavior === "function") {
        // Subclasses can add custom behavior with functions
        this.ticks.push(behavior);
        return;
    }
    
    // Check if the behavior has already been added
    if (this.hasBehavior(behavior.name)) {
        console.trace("Trying to add behavior " + behavior.name + "again...");
        return;
    }
    
    // Add the name of the behavior
    this.behaviors[behavior.name] = true; // .push(behavior.name);
    
    // Add behavior dependencies first!
    if (behavior.dependencies) {
        for (var i in behavior.dependencies) {
            this.addBehavior(Behavior[i]);
        }
    }
    
    var properties = behavior.getProperties();

    // Add all behavior properties
    for (var p in properties) {
        // Don't overwrite already existing properties
        if (!this.hasOwnProperty(p)) {
            this[p] = properties[p];
        }
    }
    
    // Modify the target's tick function
    if (behavior.tick) {
        this.ticks.push(behavior.tick);
    }
};

/**
Actions to perform at each iteration of the game loop
*/
GameObject.prototype.tick = function(gameState) {
	for (var i = 0; i < this.ticks.length; i++) {
		this.ticks[i].call(this, gameState);
	}
};

