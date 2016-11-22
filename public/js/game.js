"use strict";

const GameState = require("./game-state");
const GameController = require("./game-controller");
const gameState = new GameState();
const gameController = new GameController();
const Levels = require("./levels");
const canvas = document.getElementById("view");

gameState.parseLevel(Levels.level1);
gameController.setGameState(gameState);
gameController.setCanvas(canvas);
gameController.startGame();
