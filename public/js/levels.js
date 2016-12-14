/**
 * A collection of platform levels.
 */

"use strict";

const Levels = {

	level1: {
		width: 1600,
		height: 1000,
		objects: [
		{
			Player: {},
			Transform: {
				position: {x: 264, y: 112}
			}
		},
		{
			Tilemap: {filePath: "img/tilemaps/tilemap.png"}
		},
		{
			Block: {},
			Transform: {
				position: {x: 364, y: 96},
			}
		},
		{
			Block: {},
			Transform: {
				position: {x: 373, y: 60},
			}
		}],
		background: "DefaultBackground",
		music: "Main theme"
	}
};

for (let i = 0; i < 32; i++) {
	Levels.level1.objects.push({
		Block: {},
		Transform: {
			position: {x: 32 * i, y: 128},
		}
	});
}

module.exports = Levels;
