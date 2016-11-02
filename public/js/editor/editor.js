"use strict";

const GameController = require("../game-controller");
const GameState = require("../game-state");
const GameObject = require("../game-object");
const GraphicsLoader = require("../graphics-loader");
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
	GameState.clear();
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
		const item = UI.createListItem(icon, objectType);

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
		const item = UI.createListItem(icon, backgroundName);

		item.click(()=> {
			GameState.setBackground(backgroundName);
			GameController.render();
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
		const icon = song.getIcon();
		const item = UI.createListItem(icon, songName);

		item.click(() => {
			GameState.setMusic(song);
			GameState.getMusic().play();
		});
		UI.addListItem(item, "Music");
	});
}

/**
 * Pauses the game and sets up the GUI for editing.
 */
function enterEditMode() {
	$(canvas).removeClass("playing");
	canvas.width = GameState.getWidth();
	canvas.height = GameState.getHeight();
	GameController.pause();
	GameController.setCameraPosition(canvas.width / 2, canvas.height / 2);
	GameController.drawGrid(true);
	GameController.render();
}

/**
 * Starts the game and sets up the GUI for playing.
 */
function enterPlayMode() {
	$(canvas).addClass("playing");
	GameController.drawGrid(false);
	canvas.width = config.windowWidth;
	canvas.height = config.windowHeight;
	GameController.resume();
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

GraphicsLoader.onLoad(() => {
	initGameObjectMenu();
	initBackgroundMenu();
	initMusicMenu();
	GameController.render();
});


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
		const LEFT_MOUSE_BUTTON = 1;
		const MIDDLE_MOUSE_BUTTON = 2;
		const RIGHT_MOUSE_BUTTON = 3;
		const p = calculatePlacement(event);

		event.preventDefault();
		selectedObject = GameState.objectAtPosition(p.x, p.y);

		switch (event.which) {
			case LEFT_MOUSE_BUTTON:
				if (!selectedObject) {
					selectedObject = new GameObject(currentObject);
					GameState.addObject(selectedObject);
				}
				snapToGrid(p);
				selectedObject.position.x = p.x;
				selectedObject.position.y = p.y;
				break;
			case MIDDLE_MOUSE_BUTTON:
				break;
			case RIGHT_MOUSE_BUTTON:
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

// Disable the context menu that appears when you right click on the canvas
$('body').on('contextmenu', '#view', function(event) {
	return false;
});
