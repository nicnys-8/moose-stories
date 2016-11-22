"use strict";

const GameController = require("../game-controller");
const GameState      = require("../game-state");
const GameObject     = require("../game-object");
const GraphicsLoader = require("../graphics-loader");
const Levels         = require("../levels");
const UI             = require("./editor-ui");
const config         = require("../config");

const HIGH_VOLUME    = 1.0;
const LOW_VOLUME     = 0.2;

const gameController = new GameController();
const gameState      = new GameState();
const canvas         = document.getElementById("view");
const camera         = gameController.getCamera();

const levelSettings = {
	"Name": "New level",
	"Width": 20 * config.tileSize,
	"Height": 10 * config.tileSize
};

/** @type {string} */
let currentLevelName;
let currentObject = "Block";

/** @type {HTMLElement} */
let selectedButton = null;

/** @type {GameObject} */
let selectedObject = null;

/**
 * Clears all level data from the game state.
 */
function createNewLevel() {
	gameState.clear();
}

/**
 * @param  {MouseEvent} event - A mouse event.
 * @return {{x: number, y: number}} The event's position in the game 's coordinate system.
 */
function calculatePlacement(event) {
	return {
		x: camera.position.x + event.offsetX - canvas.width / 2,
		y: camera.position.y + event.offsetY - canvas.height / 2
	};
}

/**
 * @param  {{x: number, y: number}} p - A 2D point.
 * @return {{x: number, y: number}} An adjusted point whose x and y values are evenly divisible by config.tileSize.
 */
function snapToGrid(p) {
	p.x = config.tileSize * Math.round(p.x / config.tileSize);
	p.y = config.tileSize * Math.round(p.y / config.tileSize);
}

/**
 * Adds game object items to the menu.
 */
function initGameObjectMenu() {

	const objects = config.editor.gameObjects;

	UI.addCategory("Game Objects");
	objects.forEach(function(objectType) {

		const obj = new GameObject(objectType);
		const icon = obj.getIcon();
		const item = UI.createListItem(objectType, icon);

		item.click(function() {
			if (selectedButton) {
				selectedButton.style.backgroundColor = "";
			}
			this.style.backgroundColor = "#eee";
			currentObject = objectType;
			selectedButton = this;
		});

		if (objectType === currentObject) {
			item.click();
		}

		UI.addListItem(item, "Game Objects");
	});
}

/**
 * Adds background items to the menu.
 */
function initBackgroundMenu() {

	const backgrounds = config.editor.backgrounds;

	UI.addCategory("Backgrounds");

	backgrounds.forEach(backgroundName => {
		const background = new GameObject(backgroundName);
		const icon = background.getIcon();
		const item = UI.createListItem(backgroundName, icon);

		item.click(()=> {
			gameState.setBackground(backgroundName);
			gameController.render();
		});
		UI.addListItem(item, "Backgrounds");
	});
}

/**
 * Adds music selection to the menu.
 */
function initMusicMenu() {

	const songList = config.editor.music;

	UI.addCategory("Music");

	songList.forEach(songName => {
		const song = new GameObject("Audio", {
			name: songName
		});
		const item = UI.createListItem(songName);

		item.click(() => {
			gameState.setMusic(song);
			gameState.getMusic().play();
		});
		UI.addListItem(item, "Music");
	});
}

/**
 * Pauses the game and sets up the GUI for editing.
 */
function enterEditMode() {
	$(canvas).removeClass("playing");
	canvas.width = gameState.getWidth();
	canvas.height = gameState.getHeight();
	gameState.setMusicVolume(LOW_VOLUME);
	gameController.pause();
	gameController.setCameraPosition(canvas.width / 2, canvas.height / 2);
	gameController.drawGrid(true);
	gameController.render();
}

/**
 * Starts the game and sets up the GUI for playing.
 */
function enterPlayMode() {
	$(canvas).addClass("playing");
	gameState.setMusicVolume(HIGH_VOLUME);
	gameController.drawGrid(false);
	canvas.width = config.windowWidth;
	canvas.height = config.windowHeight;
	gameController.resume();
}


//=============
// Build the UI
//=============

$("#sidebar-right").append(UI.createForm(levelSettings,
	function(key, value) {
		switch (key) {
			case "Width":
				canvas.width = value;
				gameState.setWidth(value);
				break;
			case "Height":
				canvas.height = value;
				gameState.setHeight(value);
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
			gameState.parseLevel(levels[currentLevelName]);
			// levelSettings.width = gameState.getWidth(); FIXME: Something like this!
			// levelSettings.height = gameState.getHeight(); FIXME: Something like this!
		} else {
			createNewLevel();
		}

		gameController.setCanvas(canvas);
		gameController.setGameState(gameState);
		gameController.startGame();
		enterEditMode();
	});

GraphicsLoader.onLoad(() => {
	initGameObjectMenu();
	initBackgroundMenu();
	initMusicMenu();
	gameController.render();
});


//===============
// Set up buttons
//===============

$("#clear-button").on("click", function() {
	gameState.clear();
	gameController.render();
});

$("#pause-button").on("click", enterEditMode);
$("#play-button").on("click", enterPlayMode);


//====================
// Handle mouse events
//====================

$("#view")
	.mousedown(event => {
		const LEFT_MOUSE_BUTTON = 1;
		const MIDDLE_MOUSE_BUTTON = 2;
		const RIGHT_MOUSE_BUTTON = 3;
		const p = calculatePlacement(event);

		event.preventDefault();
		selectedObject = gameState.objectAtPosition(p.x, p.y);

		switch (event.which) {
			case LEFT_MOUSE_BUTTON:
				if (!selectedObject) {
					selectedObject = new GameObject(currentObject);
					gameState.addObject(selectedObject);
				}
				snapToGrid(p);
				selectedObject.position.x = p.x;
				selectedObject.position.y = p.y;
				break;
			case MIDDLE_MOUSE_BUTTON:
				break;
			case RIGHT_MOUSE_BUTTON:
				if (selectedObject) {
					gameState.removeObject(selectedObject);
					selectedObject = null;
				}
				break;
			default:
				console.log('You have a strange mouse!');
		}
		gameController.render();
	})
	.mousemove(event => {
		const p = calculatePlacement(event);
		snapToGrid(p);

		if (selectedObject) {
			if (p.x !== selectedObject.position.x || p.y !== selectedObject.position.y) {
				selectedObject.position = p;
				gameController.render();
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
			gameState.removeObject(selectedObject);
		}
		selectedObject = null;
	});

// Disable the context menu that appears when you right click on the canvas
$('body').on('contextmenu', '#view', function(event) {
	return false;
});
