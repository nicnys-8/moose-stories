"use strict";

var ObjectFactory = require("./objects/object-factory"),
    AudioFactory = require("./audio-factory"),
    Background = require("./background"),
    GameState;

/**
Returns the constructor of an object describing the state of a gaming session
*/
GameState = function() {

    // Cache for storing filter queries
    var cache = {
        exlude: {},
        include: {}
    };

    function clearCache() {
        cache.exlude = {};
        cache.include = {};
    }


    //=================
    // Public Interface
    //=================

    this.objects = [];
    this.backgrounds = [];
    this.objectsByUID = {};
    this.music = null;

    this.cacheHits = 0;
    this.cacheMisses = 0;

    this.addObject = function(obj) {
        this.objects.push(obj);

        if (obj.uid !== null && (typeof obj.uid !== "undefined")) { // obj.uid is false when uid == 0...

            if (this.objectsByUID[obj.uid]) {
                console.warn("Uh oh, maybe UID " + obj.uid + " is not as unique as you thought!");
            }

            this.objectsByUID[obj.uid] = obj;
        }

        clearCache();
    };

    this.removeObject = function(obj) {
        var index = this.objects.indexOf(obj);
        if (index) {
            this.objects.splice(index, 1);
            if (obj.uid) {
                delete this.objectsByUID[obj.uid];
            }
            clearCache();
        }
    };

    this.addBackground = function(bkg) {
        this.backgrounds.push(bkg);
    };

    /**
     * Filters a list of GameObjects. Can extract all GameObjects matching:
     * 		-  any behavior in the filter set
     * 		-  no behavior in the filter set
     * 	depending on whether type parameter is set to "include" or "exlude"
     * 	respectively.
     *
     * Can be called as:
     * 		- filter( "Moving" );
     * 			Returns all moving GameObjects in this.objects.
     * 		- filter( ["Moving", "Solid"] );
     * 			Returns all 'solid and moving' GameObjects in this.objects.
     * 		- filter( "Controllable", "exclude");
     * 			Returns all non-controllable GameObjects in this.objects.
     * 		- filter( ["Moving", "Solid"], "include", filter("Controllable", "exclude")) );
     * 			Returns all non-controllable GameObjects that are moving and solid in this.objects.
     *
     * @param  {[string]} 		filter 		Behaviors that act as filters
     * @param  {string} 		type 		Either "include" or "exclude". Default is "include".
     * @param  {[GameObject]} 	objects 	A list of objects which to filter. Default is this.objects.
     * @return {[GameObject]}				Filtered list of GameObjects
     */
    this.filter = function(filter, type, objects) {
        //@TODO: Cache lookups to increase efficiency!
        // filter  = (typeof filter  !== 'string')    ? filter  : [filter];
        type = (typeof type !== 'undefined') ? type : "include";
        // objects = (typeof objects !== 'undefined') ? objects : this.objects;

        var query,
            cachedQuery,
            storeQuery = false,
            i, j, flen,
            filteredObjects = [],
            currentObject;

        if (typeof filter === "string") { // Only 99.7% safe to use typeof with strings!! :)
            query = filter;
            filter = [filter];
        } else {
            query = filter.join("/");
        }

        // Crappy caching (only when searching all objects (for now (maybe))) :D
        // Ett varningens ord, ja lyssna nu: Om behaviors läggs till under spelets gång FÖRLORAR DU - Klotho, Lachesis eller Atropos
        if (typeof objects === "undefined") {
            cachedQuery = cache[type][query];
            if (cachedQuery) {
                this.cacheHits++;
                return cachedQuery;
            } else {
                // this.cacheMisses++;
                objects = this.objects;
                storeQuery = true;
            }
        }
        this.cacheMisses++;

        flen = filter.length;

        switch (type) {
            case "exclude":
                for (i = 0; i < objects.length; i++) {
                    currentObject = objects[i];
                    for (j = 0; j < flen; j++) {
                        if (currentObject.hasBehavior(filter[j])) {
                            break;
                        }
                    }
                    // Exclude object if it has ANY of the behaviors in 'filter'
                    if (j === flen) {
                        filteredObjects.push(currentObject);
                    }
                }
                break;
                //case "include":
            default:
                for (i = 0; i < objects.length; i++) {
                    currentObject = objects[i];
                    for (j = 0; j < flen; j++) {
                        // Include object if it has ANY of the behaviors in 'filter'
                        if (currentObject.hasBehavior(filter[j])) {
                            filteredObjects.push(currentObject);
                            break;
                        }
                    }
                }
                break;
        }

        if (storeQuery) {
            cache[type][query] = filteredObjects;
        }

        return filteredObjects;
    };

    /**
     * Completely resets the game state
     */
    this.clear = function() {
        this.objects = [];
        this.backgrounds = [];
        this.objectsByUID = {};
        this.music = null;
        clearCache();
    };

    /**
     * Returns all objects that intersect the specified area.
     */
    this.objectsInZone = function(left, right, top, bottom) {
        var pObjects = this.filter("Physical");
        var result = [];
        var obj;
        for (var i = 0; i < pObjects.length; i++) {
            obj = pObjects[i];
            if (!(
                    obj.x + obj.boundingBox.left >= right ||
                    obj.x + obj.boundingBox.right <= left ||
                    obj.y + obj.boundingBox.top >= bottom ||
                    obj.y + obj.boundingBox.bottom <= top)
				) {
                result.push(obj);
            }
        }
        return result;
    };

    /**
     * Returns all objects at the specified position.
     */
    this.objectsAtPosition = function(x, y) {
        this.objectsInZone(x, x, y, y);
    };

    /**
     * If there are any objects at the specified position, one of these is returned.
     * Otherwise null.
     * TODO: Return the object with the lowest z-index
     */
    this.objectAtPosition = function(x, y) {
        var closest = this.objectsInZone(x, x, y, y)[0];
        return closest || null;
    };

    /**
    Returns the object with the specified UID
    */
    this.getObjectByUID = function(uid) {
        return this.objectsByUID[uid];
    };

    /**
    Creates all objects from a level description
    @TODO: Parsaren ska fungera annorlunda i framtiden...!
    */
    this.parseLevel = function(description) {
        var objDesc, obj, bkgDesc, bkg, i, len;

        // Clear the state first!
        this.clear();

        len = description.objects && description.objects.length || 0;
        for (i = 0; i < len; i++) {
            objDesc = description.objects[i];
            obj = ObjectFactory.createObject(objDesc);
            this.addObject(obj);
        }

        len = description.backgrounds && description.backgrounds.length || 0;
        for (i = 0; i < len; i++) {
            bkgDesc = description.backgrounds[i];
            bkg = new Background(bkgDesc);
            this.addBackground(bkg);
        }

        if (description.music) {
            this.music = AudioFactory.createSound(description.music);
            // this.music.play();
        }
    };

    this.exportJSON = function() {
        var type, src, dst, i, j, len,
            // Properties to export
            exports = ["objects", "backgrounds", "music"],
            // Result
            json = {};

        for (i in exports) {
            type = exports[i];
            src = this[type];
            dst = [];

            // Is there anything to export?
            if (!src || src.length === 0) {
                console.log("No " + type + " to export!");
                continue;
            }

            // Export stuff!
            for (j = 0, len = src.length; j < len; j++) {
                if (src[j].exportJSON) {
                    dst.push(src[j].exportJSON());
                } else {
                    console.log("No export function for " + type + ": " + j);
                }
            }

            // Was anything exported?
            if (dst.length > 0) {
                json[type] = dst;
            }
        }

        return json;
    };

    /**
    Perform update functions for all in-game objects
    */
    this.tick = function() {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].tick();
        }
    };
};

module.exports = new GameState();
