"use strict";

const gameState = require("./game-state");
const gameController = require("./game-controller");
const Levels = require("./levels");
const canvas = document.getElementById("view");

gameState.parseLevel(Levels.level1);
gameController.setGameState(gameState);
gameController.setCanvas(canvas);
gameController.startGame();
