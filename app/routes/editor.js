"use strict";

const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const levelDirectory = path.join(__dirname, "../../public/levels");
const levels = {};

let backgrounds = [];

function loadLevels() {

	const levelFiles = fs.readdirSync(levelDirectory);

	for (let i in levelFiles) {
		let filename = levelFiles[i];

		try {
			let level = require(path.join(levelDirectory, filename));
			levels[filename.split(".")[0]] = level;
		} catch (err) {
			console.log("Failed to load level " + filename);
		}
	}
}

function loadPaths(dst, dir, sub) {

	const filepath = path.join(__dirname, "../../public/", dir, sub),
		files = fs.readdirSync(filepath);

	for (let i in files) {
		let filename = files[i],
			stats = fs.lstatSync(filepath + "/" + filename);

		if (stats.isDirectory()) {
			loadPaths(dst, dir, sub + filename + "/");
		} else {
			dst.push(dir + sub + filename);
		}
	}
}

loadLevels();
loadPaths(backgrounds, "/img/backgrounds", "/");
backgrounds = ["DefaultBackground"];
router.get("/backgrounds", function(req, res) {
	res.send(backgrounds);
});
router.get("/levels", function(req, res) {
	res.send(levels);
});
router.post("/save", function(req, res) {
	const name = req.body.name;
	const firstName = name.split(".")[0];
	const filename = firstName + ".json";
	const filePath = path.join(levelDirectory, filename);

	levels[firstName] = req.body.level;

	// TODO: Validate level data and so on and so forth...
	fs.writeFile(filePath,
		JSON.stringify(req.body.level, null, 4),
		function(err) {
			if (err) {
				console.log(err);
				res.status(418).send("Sorry :)");
			} else {
				console.log("Level saved to " + filePath);
				res.send(filename);
			}
		});
});

module.exports = router;
