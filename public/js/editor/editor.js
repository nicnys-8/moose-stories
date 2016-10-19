"use strict";

const GameController = require("../game-controller");
const GameState = require("../game-state");
const GameObject = require("../game-object");
const Levels = require("../levels");
const UI = require("./editor-ui");
const config = require("../config");

const canvas = document.getElementById("view");
const camera = GameController.getCamera();

const levelSettings = {
	"Name": "New level",
	"Width": 20 * config.tileSize,
	"Height": 10 * config.tileSize
};

let currentObject = "Block";
let currentLevelName = null;
let selectedButton = null;
let selectedObject = null;

/**
 * Clears all level data from the game state.
 */
function createNewLevel() {
	GameState.clear();
}

/**
 * @param {MouseEvent} event - A mouse event.
 * @return {{x: number, y: number}} The event's position in the game 's coordinate system.
 */
function calculatePlacement(event) {
	return {
		x: camera.position.x + event.offsetX - canvas.width / 2,
		y: camera.position.y + event.offsetY - canvas.height / 2
	};
}

/**
 * @param {{x: number, y: number}} p - A 2D point.
 * @return {{x: number, y: number}} An adjusted point whose x and y values are evenly divisible by config.tileSize.
 */
function snapToGrid(p) {
	p.x = config.tileSize * Math.round(p.x / config.tileSize);
	p.y = config.tileSize * Math.round(p.y / config.tileSize);
}

/**
 * Adds the game object items to the menu.
 */
function initGameObjectMenu() { // Replace with ajax request

	function selectFn(objectType) {
		return function() {
			if (selectedButton) {
				selectedButton.style.backgroundColor = "";
			}
			this.style.backgroundColor = "#eee";
			currentObject = objectType;
			selectedButton = this;
		};
	}

	const objects = config.editor.gameObjects;

	UI.addCategory("Game Objects");
	objects.forEach(function(objectType) {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const item = UI.createListItem(canvas, "&nbsp;", objectType);
		const obj = new GameObject(objectType);

		item.click(selectFn(objectType));

		if (objectType === currentObject) {
			item.click();
		}

		UI.addListItem(item, "Game Objects");

		if (obj.hasBehavior("Renderable")) {
			try {
				const w = obj.boundingBox.right - obj.boundingBox.left;
				const h = obj.boundingBox.bottom - obj.boundingBox.top;

				obj.position.x = 0; //w / 2;
				obj.position.y = 0; //h / 2;
				canvas.width = w;
				canvas.height = h;
				window["skam" + window.i++] = function() {
					obj.render(ctx);
					console.log(w, h);
				}; //FIXME: Remove
				obj.render(ctx);
				UI.addListItem(item, "Game Objects");
			} catch (err) {
				console.log("Failed, ", err);
			}
		}
	});
}

window.i = 0; //FIXME: Remove

/**
 * Adds the background items to the menu.
 */
function initBackgroundMenu() {

	const backgrounds = config.editor.backgrounds;

	function selectFn(background) {
		return function() {
			GameState.setBackground(background);
		};
	}

	UI.addCategory("Backgrounds");

	for (let i = 0; i < backgrounds.length; i++) {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const item = UI.createListItem(canvas, "&nbsp;", backgrounds[i]);
		const bkg = new GameObject(backgrounds[i]);

		item.click(selectFn(backgrounds[i]));
		UI.addListItem(item, "Backgrounds");
		try {
			const w = 64;
			const h = 64;

			bkg.x = w / 2;
			bkg.y = h / 2;
			canvas.width = w;
			canvas.height = h;
			bkg.render(ctx);

		} catch (err) {
			console.log("Failed, ", err);
		}
	}
}

/**
 * Adds music selection to the menu.
 */
function initMusicMenu() {

	function selectFn(song) {
		return function() {
			GameState.setMusic(song);
			GameState.getMusic().play();
		};
	}

	UI.addCategory("Music");
	config.editor.music.forEach(songName => {
		const item = UI.createListItem(null, "&nbsp;", songName);
		const song = new GameObject("Audio", {
			name: songName
		});

		item.click(() => {
			GameState.setMusic(song);
			GameState.getMusic().play();
		});
		UI.addListItem(item, "Music");
	});
}

/**
 * Pauses the game and adapts the GUI for editing.
 */
function enterEditMode() {
	$(canvas).removeClass("playing");
	GameController.pause();
	GameController.drawGrid(true);
	canvas.width = GameState.getWidth();
	canvas.height = GameState.getHeight();
	GameController.setCameraPosition(canvas.width / 2, canvas.height / 2);
	GameController.render();
}

/**
 * Starts the game and adapts the GUI for playing.
 */
function enterPlayMode() {
	$(canvas).addClass("playing");
	GameController.resume();
	GameController.drawGrid(false);
	canvas.width = config.windowWidth;
	canvas.height = config.windowHeight;
}


//=============
// Build the UI
//=============

$("#sidebar-right").append(UI.createForm(levelSettings,
	function(key, value) {
		switch (key) {
			case "Width":
				canvas.width = value;
				GameState.setWidth(value);
				break;
			case "Height":
				canvas.height = value;
				GameState.setHeight(value);
				break;
		}
	}));

$.get("/levels",
	function(levels) {

		const dropdown = $("#levelList");
		let i, opt;

		dropdown.empty();

		for (i in levels) {
			opt = $("<option></option>").attr("value", i).html(i);
			if (!currentLevelName) {
				opt.attr("selected", true);
				currentLevelName = i;
			}
			dropdown.append(opt);
		}

		if (currentLevelName) {
			GameState.parseLevel(levels[currentLevelName]);
			// levelSettings.width = GameState.getWidth(); FIXME: Something like this!
			// levelSettings.height = GameState.getHeight(); FIXME: Something like this!
		} else {
			createNewLevel();
		}

		GameController.setCanvas(canvas);
		GameController.startGame();
		enterEditMode();
	});

initGameObjectMenu();
initBackgroundMenu();
initMusicMenu();


//===============
// Set up buttons
//===============

$("#clear-button").on("click", function() {
	GameState.clear();
	GameController.render();
});

$("#pause-button").on("click", enterEditMode);
$("#play-button").on("click", enterPlayMode);


//====================
// Handle mouse events
//====================

$("#view")
	.mousedown(event => {
		const p = calculatePlacement(event),
			leftMouseButton = 1,
			middleMouseButton = 2,
			rightMouseButton = 3;

		event.preventDefault();
		selectedObject = GameState.objectAtPosition(p.x, p.y);

		switch (event.which) {
			case leftMouseButton:
				if (!selectedObject) {
					selectedObject = new GameObject(currentObject);
					GameState.addObject(selectedObject);
				}
				snapToGrid(p);
				selectedObject.position.x = p.x;
				selectedObject.position.y = p.y;
				break;
			case middleMouseButton:
				break;
			case rightMouseButton:
				if (selectedObject) {
					GameState.removeObject(selectedObject);
					selectedObject = null;
				}
				break;
			default:
				console.log('You have a strange mouse!');
		}
		GameController.render();
	})
	.mousemove(event => {
		const p = calculatePlacement(event);
		snapToGrid(p);

		if (selectedObject) {
			if (p.x !== selectedObject.position.x || p.y !== selectedObject.position.y) {
				selectedObject.position = p;
				GameController.render();
			}
		}

		$("#mouseX").text(p.x);
		$("#mouseY").text(p.y);

	})
	.bind("mouseup", event => {
		selectedObject = null;
	})
	.bind("mouseout", event => {
		if (selectedObject) {
			GameState.removeObject(selectedObject);
		}
		selectedObject = null;
	});

// Disable the context menu that appears on right click on the canvas
$('body').on('contextmenu', '#view', function(e) {
	return false;
});
