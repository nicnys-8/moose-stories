"use strict";

const gameState = require("./game-state"),
	gameController = require("./game-controller"),
	Levels = require("./levels"),
	canvas = document.getElementById("view");

gameState.parseLevel(Levels.level1);
gameController.setCanvas(canvas);
gameController.startGame();
