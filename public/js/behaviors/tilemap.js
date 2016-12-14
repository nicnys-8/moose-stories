/**
 * Describes a tilemap object.
 */

"use strict";

const Behaviors = require("../behaviors");
const GraphicsLoader = require("../graphics-loader");
const config = require("../config");
//const {EMPTY, SOLID} = require("../tileTypes");
const EMPTY = 0;
const SOLID = 1;
const NO_TILE = -1;

const behavior = {};
const tileSize = config.tileSize;

behavior.dependencies = ["Solid", "Renderable"];

/**
 * Initialization function, called on an object
 * when this behavior is added to it.
 *
 * @param {string} filePath - Path to the image file.
 */
behavior.init = function({filePath, tiles}) {

	const numTiles = {};

	if (typeof filePath !== "string") {
		throw new Error("'Tilemap' behavior requires string argument 'filePath'.");
	}

	/**
	 * Returns the row and column of a given tile.
	 *
	 * @param  {number} tile - The number of the tile to check.
	 * @return {object} e.g. {row: 0, column: 4} 
	 */
	function tileToCoordinates(tile) {
		const row = Math.floor(tile / numTiles.y);
		const column = tile % numTiles.x;

		return {row, column};
	}

	/*function coordinatesToTile(row, column) {
		return Math.floor(row / tileSize)
	}*/

	this.map = [
		[EMPTY, SOLID, SOLID],
		[SOLID, SOLID, SOLID],
		[SOLID, SOLID, SOLID]
	];

	this.tiles = [
		[NO_TILE, NO_TILE, NO_TILE, NO_TILE],
		[NO_TILE, NO_TILE, NO_TILE, NO_TILE],
		[NO_TILE, NO_TILE, 1, NO_TILE]
	];
	
	this.canvas = GraphicsLoader.loadImage(filePath);
	GraphicsLoader.onLoad(() => {
		numTiles.x = Math.floor(this.canvas.width / tileSize);
		numTiles.y = Math.floor(this.canvas.height / tileSize);
	});
	
	/**
	 * Renders the tilemap on screen.
	 *
	 * @param {CanvasRenderingContext2D} ctx - 2D rendering context.
	 */
	this.render = function(ctx) {
		this.tiles.forEach((row, rowIndex) => {
			row.forEach((tile, columnIndex) => {
				if (tile === NO_TILE) {
					return;
				}
				const {row, column} = tileToCoordinates(tile);
				const clipX = column * tileSize;
				const clipY = row * tileSize;
				const x = columnIndex * tileSize;
				const y = rowIndex * tileSize;

				ctx.save();
				ctx.translate(this.position.x, this.position.y);
				ctx.drawImage(
					this.canvas,
					clipX, clipY, // Clipping width
					tileSize, tileSize,
					x, y,
					tileSize, tileSize // Image width
				);
				ctx.restore();
			});
		});
	};

	function tightenBounds(area) {

	}

	/**
	 * Describes how much the object is overlapping a given area. An object on the
	 * form {top, bottom, left, right} is returned, where each property specifies
	 * how many pixels (a non-negative number) are overlapped.
	 *
	 * @param  {object} area - The area to check for overlaps.
	 * @return {Object} Object describing current overlaps.
	 */
	 this.getOverlap = function(area) {
	 	const overlap = {
	 		top:    0,
	 		bottom: 0,
	 		left:   0,
	 		right:  0
	 	};
	 	let i = area.top - (area.top % tileSize);
	 	while (i < area.bottom) {
	 		let j = area.left - (area.left % tileSize);
	 		while (j < area.right) {
	 			const row = j / tileSize;
	 			const column = i / tileSize;
	 			if (row < numTiles.x && column < numTiles.y) {
	 				const tile = this.tiles[row][column];
	 				if (tile === SOLID) {
	 					const tileTop    = i;
	 					const tileBottom = i + tileSize;
	 					const tileLeft   = j;
	 					const tileRight  = j + tileSize;
	 					// Overlap from below:
	 					if (tileTop < area.bottom && tileBottom > area.bottom) {
	 						overlap.bottom = Math.max(
	 							overlap.bottom,
	 							area.bottom - tileTop
	 						);
	 					}
	 					// Overlap from the left side:
	 					if (tileLeft < area.left && tileRight > area.left) {
	 						overlap.left = Math.max(
	 							overlap.left,
	 							tileRight - area.left
	 						);
	 					}
	 					// Overlap from the right side:
	 					if (tileLeft < area.right && tileRight > area.right) {
	 						overlap.right = Math.max(
	 							overlap.right,
	 							area.right - tileLeft
	 						);
	 					}
	 					// Overlap from above:
	 					if (tileTop < area.top && tileBottom > area.top) {
	 						overlap.right = Math.max(
	 							overlap.right,
	 							area.right - tileLeft
	 						);
	 					}
	 				}	
	 			}
	 			j += tileSize;
	 		}
	 		i += tileSize;
	 	}
	 	return overlap;
	 };

};

Behaviors.register("Tilemap", behavior);
