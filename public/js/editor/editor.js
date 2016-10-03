"use strict";

var GameState = require("../game-state"),
    GameController = require("../game-controller"),
    GameObject = require("../game-object"),
    camera = require("../camera"),
    Levels = require("../levels"),
    UI = require("./editor-ui"),
    config = require("../config"),
    canvas = document.getElementById("view"),
    currentObject = "Block",
    currentLevelName = null,
    selectedButton = null,
    selectedObject = null,
    levels,
    levelSettings;

UI.addCategory("Game Objects");
UI.addCategory("Backgrounds");
UI.addCategory("Music");

function createNewLevel() {
    GameState.clear();
}

function calculatePlacement(event) {
    var x = camera.x + event.offsetX - canvas.width / 2,
        y = camera.y + event.offsetY - canvas.height / 2,
        snap = levelSettings["Snap to grid"], // blää
        snapX = config.tileSize,
        snapY = config.tileSize;
    return {
        x: snap ? (snapX * Math.round(x / snapX)) : Math.round(x),
        y: snap ? (snapY * Math.round(y / snapY)) : Math.round(y)
    };
}

levelSettings = {
    "Name": "New level",
    "Width": 20 * config.tileSize,
    "Height": 10 * config.tileSize,
    "Snap to grid": true
};

$("#sidebar-right").append(UI.createForm(levelSettings,
    function(key, value) {
        switch (key) {
            case "Width":
                canvas.width = value;
                break;
            case "Height":
                canvas.height = value;
                break;
        }
        console.log(key + " changed to " + value);
    }));

$.get("/levels",
    function(data) {
        levels = data;

        var sel = null,
            i, opt,
            dropdown = $("#levelList");

        dropdown.empty();

        for (i in data) {
            opt = $("<option></option>").attr("value", i).html(i);
            if (!currentLevelName) {
                opt.attr("selected", true);
                currentLevelName = i;
            }
            dropdown.append(opt);
        }

        if (currentLevelName) {
            GameState.parseLevel(levels[currentLevelName]);
        } else {
            createNewLevel();
        }

        GameController.setCanvas(canvas);
        GameController.startGame();
    });

$.get("/backgrounds",
    function(data) {});

setTimeout(function() { // Replace with ajax request

    function selectFn(background) {
        return function() {
            GameState.setBackground(background);
        };
    }

    var i, w, h, bkg, canvas, ctx, item, backgrounds;

    backgrounds = ["DefaultBackground", "MountainBackground"];

    for (i = 0; i < backgrounds.length; i++) {

        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        item = UI.createListItem(canvas, "&nbsp;", backgrounds[i]);
        item.click(selectFn(backgrounds[i]));
        bkg = new GameObject(backgrounds[i]);

        try {
            w = 64; // obj.boundingBox.right - obj.boundingBox.left;
            h = 64; // obj.boundingBox.bottom - obj.boundingBox.top;
            bkg.x = w / 2;
            bkg.y = h / 2;
            canvas.width = w;
            canvas.height = h;
            bkg.render(ctx);
            UI.addListItem(item, "Backgrounds");
        } catch (err) {
            console.log("Failed, ", err);
        }
    }
}, 1000);

setTimeout(function() { // Replace with ajax request

    function selectFn(objectName) {
        return function() {
            if (selectedButton) {
                selectedButton.style.backgroundColor = "";
            }
            this.style.backgroundColor = "#eee";
            currentObject = objectName;
            selectedButton = this;
        };
    }

    var i, w, h, obj, canvas, ctx, item, classes;

    classes = ["Player", "Block"]; // TODO: Move somewhere else

    for (i = 0; i < classes.length; i++) {

        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        item = UI.createListItem(canvas, "&nbsp;", classes[i]);
        item.click(selectFn(classes[i]));
        obj = new GameObject(classes[i]);

        if (classes[i] === currentObject) {
            item.click();
        }
        if (obj.hasBehavior("Renderable")) {
            try {
                w = 64; // obj.boundingBox.right - obj.boundingBox.left;
                h = 64; // obj.boundingBox.bottom - obj.boundingBox.top;
                obj.x = w / 2;
                obj.y = h / 2;
                canvas.width = w;
                canvas.height = h;
                obj.render(ctx);
                UI.addListItem(item, "Game Objects");
            } catch (err) {
                console.log("Failed, ", err);
            }
        }
    }
}, 1000); // TODO: Actually wait until the graphics are loaded

//===============
// Set up buttons
//===============

$("#clear-button").on("click", function() {
    selectedObject = null;
    GameState.clear();
});

$("#pause-button").on("click", function() {
    GameController.pause();
});

$("#play-button").on("click", function() {
    GameController.resume();
});

$("#view")
    .mousedown(function(event) {
        var p = calculatePlacement(event),
            leftMouseButton = 1,
            middleMouseButton = 2,
            rightMouseButton = 3;

        event.preventDefault();
        selectedObject = GameState.objectAtPosition(p.x, p.y);

        switch (event.which) {
            case leftMouseButton:
                if (!selectedObject) {
                    selectedObject = new GameObject(currentObject, {
                        x: p.x,
                        y: p.y,
                    });
                    GameState.addObject(selectedObject);
                }
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
    })
    .mousemove(function(event) {

        var p = calculatePlacement(event);

        if (selectedObject) {
            selectedObject.x = p.x;
            selectedObject.y = p.y;
        }

        $("#mouseX").text(p.x);
        $("#mouseY").text(p.y);

    })
    .bind("mouseup", function(event) {
        selectedObject = null;
    })
    .bind("mouseout", function(event) {
        if (selectedObject) {
            GameState.removeObject(selectedObject);
        }
        selectedObject = null;
    });

// Disable the context menu that appears on right click on the canvas
$('body').on('contextmenu', '#view', function(e) {
    return false;
});
