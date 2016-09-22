var express = require("express"),
    fs = require("fs"),
    path = require("path"),
    router = express.Router(),
    levelDirectory = path.join(__dirname, "../../public/levels"),
    levels = {},
    backgrounds = [];

function loadLevels() {

    var levelFiles = fs.readdirSync(levelDirectory),
        i, filename, level;

    for (i in levelFiles) {
        filename = levelFiles[i];

        try {
            level = require(path.join(levelDirectory, filename));
            levels[filename.split(".")[0]] = level;
        } catch (err) {
            console.log("Failed to load level " + filename);
        }
    }
}

function loadPaths(dst, dir, sub) {

    var filepath = path.join(__dirname, "../../public/", dir, sub),
        files = fs.readdirSync(filepath),
        i, filename, stats;

    for (i in files) {
        filename = files[i];
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

router.get("/backgrounds", function(req, res) {
    res.send(backgrounds);
});
router.get("/levels", function(req, res) {
    res.send(levels);
});
router.post("/save", function(req, res) {
    var name = req.body.name,
        firstName = name.split(".")[0],
        filename = firstName + ".json",
        path = path.join(levelDirectory, filename);

    levels[firstName] = req.body.level;

    // TODO: Validate level data and so on and so forth...
    fs.writeFile(path,
        JSON.stringify(req.body.level, null, 4),
        function(err) {
            if (err) {
                console.log(err);
                res.status(418).send("Sorry :)");
            } else {
                console.log("Level saved to " + path);
                res.send(filename);
            }
        });
});

module.exports = router;
