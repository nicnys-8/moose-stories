/**
 * An object describing the state of the game ('model' in the MVC pattern).
 */

"use strict";

const GameObject = require("./game-object");

/**
 * Instantiates an object describing the game state.
 *
 * @constructor
 * @this {GameState}
 */
function GameState() {

	//================================
	// Private variables and functions
	//================================

	let objects = [];
	let objectsByUID = {};

	let cache = { // Cache for storing filter queries
			exlude: {},
			include: {}
		};

	let background = null;
	let music = null;

	let width = 0;
	let height = 0;

	let cacheHits = 0;
	let cacheMisses = 0;

	function clearCache() {
		cache.exlude = {};
		cache.include = {};
	}

	//=================
	// Public Interface
	//=================

	this.addObject = function(obj) {
		objects.push(obj);

		if (obj.uid !== null && (typeof obj.uid !== "undefined")) { // obj.uid is false when uid == 0...

			if (objectsByUID[obj.uid]) {
				console.warn("Uh oh, maybe UID " + obj.uid + " is not as unique as you thought!");
			}

			objectsByUID[obj.uid] = obj;
		}

		clearCache();
	};

	this.removeObject = function(obj) {
		const index = objects.indexOf(obj);
		if (index) {
			objects.splice(index, 1);
			if (obj.uid) {
				delete objectsByUID[obj.uid];
			}
			clearCache();
		}
	};

	/**
	 * Filters a list of GameObjects. Can extract all GameObjects matching:
	 *      -  any behavior in the filter set
	 * 		-  no behavior in the filter set
	 * 	depending on whether type parameter is set to "include" or "exlude"
	 * 	respectively.
	 *
	 * Can be called as:
	 * 		- filter( "Moving" );
	 * 			Returns all moving GameObjects in objects.
	 * 		- filter( ["Moving", "Solid"] );
	 * 			Returns all 'solid and moving' GameObjects in objects.
	 * 		- filter( "Controllable", "exclude");
	 * 			Returns all non-controllable GameObjects in objects.
	 * 		- filter( ["Moving", "Solid"], "include", filter("Controllable", "exclude")) );
	 * 			Returns all non-controllable GameObjects that are moving and solid in objects.
	 *
	 * @param  {[string]} filter - Behaviors that act as filters
	 * @param  {string} type - Either "include" or "exclude". Default is "include".
	 * @param  {[GameObject]} unfiltered - A list of objects which to filter. Default is objects.
	 * @return {[GameObject]} Filtered list of GameObjects
	 */
	this.filter = function(filter, type, unfiltered) {
		type = (typeof type !== "undefined") ? type : "include";

		const filteredObjects = [];

		let query;
		let cachedQuery;
		let flen;

		let storeQuery = false;
		let currentObject = null;

		if (typeof filter === "string") { // Only 99.7% safe to use typeof with strings!! :)
			query = filter;
			filter = [filter];
		} else {
			query = filter.join("/");
		}

		// Crappy caching (only when searching all objects (for now (maybe))) :D
		// Ett varningens ord, ja lyssna nu: Om behaviors läggs till under spelets gång FÖRLORAR DU - Klotho, Lachesis eller Atropos
		if (typeof unfiltered === "undefined") {
			cachedQuery = cache[type][query];
			if (cachedQuery) {
				cacheHits++;
				return cachedQuery;
			} else {
				// this.cacheMisses++;
				unfiltered = objects;
				storeQuery = true;
			}
		}
		this.cacheMisses++;

		flen = filter.length;

		switch (type) {
			case "exclude":
				for (let i = 0; i < unfiltered.length; i++) {
					let j = 0;

					currentObject = unfiltered[i];
					for (j; j < flen; j++) {
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
				for (let i = 0; i < unfiltered.length; i++) {
					currentObject = unfiltered[i];
					for (let j = 0; j < flen; j++) {
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
	 * Completely resets the game state.
	 */
	this.clear = function() {
		objects = [];
		objectsByUID = {};
		background = null;
		music = null;
		clearCache();
	};

	/**
	 * Returns all objects that intersect the specified area.
	 *
	 * @param {number} left Left position
	 * @param {number} right Right position
	 * @param {number} top Top position
	 * @param {number} bottom I'll leave the last one as an exercise for the reader.
	 */
	this.objectsInZone = function(left, right, top, bottom) {
		const pObjects = this.filter("Physical"),
			result = [];

		pObjects.forEach(obj => {
			if (!(
					obj.position.x + obj.boundingBox.left >= right ||
					obj.position.x + obj.boundingBox.right <= left ||
					obj.position.y + obj.boundingBox.top >= bottom ||
					obj.position.y + obj.boundingBox.bottom <= top)) {
				result.push(obj);
			}
		});
		return result;
	};

	/**
	 * @return {[GameObject]} All game objects at the specified position.
	 */
	this.objectsAtPosition = function(x, y) {
		this.objectsInZone(x, x, y, y);
	};

	/**
	 * If there are any objects at the specified position, one of these is returned.
	 * Otherwise null.
	 *
	 * @param {number} x Horizontal position.
	 * @param {number} y Vertical position.
	 * @return {GameObject} The object at the given position.
	 */
	this.objectAtPosition = function(x, y) {
		// TODO: Return the object with the lowest z-index
		const closest = this.objectsInZone(x, x, y, y)[0];
		return closest || null;
	};

	/**
	 * @param {number} uid A unique GameObject ID.
	 * @return {GameObject} The object with the given UID.
	 */
	this.getObjectByUID = function(uid) {
		return this.objectsByUID[uid];
	};

	/**
	 * Creates all objects from a level description.
	 *
	 * @TODO: Parsaren ska fungera annorlunda i framtiden...!
	 * @param {object} description ...  @TODO: Needs a description :)
	 */
	this.parseLevel = function(description) {
		const len = description.objects && description.objects.length || 0;

		// Clear the state first!
		this.clear();

		// Set width and height of the level
		width = Number(description.width);
		height = Number(description.height);

		for (let i = 0; i < len; i++) {
			const objDesc = description.objects[i];
			const obj = new GameObject(objDesc.behaviors, objDesc.args);

			this.addObject(obj);
		}

		//background = new GameObject("Background", description.background);
		background = new GameObject(description.background);

		if (description.music) {
			music = new GameObject("Audio", {
				name: description.music,
				looping: true
			});
		}
	};

	this.exportJSON = function() {
		let type, src, dst, len,
			// Properties to export
			exports = ["objects", "backgrounds", "music"],
			// Result
			json = {};

		for (let i in exports) {
			type = exports[i];
			src = this[type];
			dst = [];

			// Is there anything to export?
			if (!src || src.length === 0) {
				console.log("No " + type + " to export!");
				continue;
			}

			// Export stuff!
			for (let j = 0, len = src.length; j < len; j++) {
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
	 * @return {Background} The current background.
	 */
	this.getBackground = function() {
		return background;
	};

	/**
	 * Sets the current background image.
	 *
	 * @param {string} backgroundName Name of the background.
	 */
	this.setBackground = function(backgroundName) {
		background = new GameObject(backgroundName);
	};

	this.getMusic = function() {
		return music;
	};

	this.setMusic = function(msc) {
		if (music) {
			music.stop();
		}
		music = msc;
	};

	this.setWidth = function(w) {
		width = w;
	};

	this.getWidth = function() {
		return width;
	};

	this.setHeight = function(h) {
		height = h;
	};

	this.getHeight = function() {
		return height;
	};

	/**
	 * Updates all in-game objects, i.e. a single step in the main game loop.
	 */
	this.tick = function() {
		for (let i = 0; i < objects.length; i++) {
			objects[i].tick();
		}
	};
}

module.exports = new GameState();
