"use strict";

var GameState = require("../game-state"),
    GameObject = require("../game-object"),
    GameController = require("../game-controller"),
    Levels = require("../levels"),
    UI = require("./editor-ui"),
    config = require("../config"),
    canvas = document.getElementById("view"),
    camera = GameController.getCamera(),
    currentObject = "Block",
    currentLevelName = null,
    selectedButton = null,
    selectedObject = null,
    levels,
    levelSettings = {
        "Name": "New level",
        "Width": 20 * config.tileSize,
        "Height": 10 * config.tileSize
    };

/**
 * Clears all level data from the game state.
 */
function createNewLevel() {
    GameState.clear();
}

/**
 * @param {MouseEvent} event A mouse event.
 * @return {{x: number, y: number}} The event's position in the game 's coordinate system.
 */
function calculatePlacement(event) {
    var x = camera.position.x + event.offsetX - canvas.width / 2,
        y = camera.position.y + event.offsetY - canvas.height / 2;
    return {
        x: Math.round(x),
        y: Math.round(y)
    };
}

/**
 * @param {{x: number, y: number}} p A 2D point.
 * @return {{x: number, y: number}} An adjusted point whose x and y values are evenly divisible by config.tileSize.
 */
function snapToGrid(p) {
    return {
        x: config.tileSize * Math.floor(p.x / config.tileSize),
        y: config.tileSize * Math.floor(p.y / config.tileSize)
    };
}

/**
 * Adds the game object items to the menu.
 */
function initGameObjects() { // Replace with ajax request

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

    var i, w, h, obj, canvas, ctx, item, objects;

    objects = config.editor.gameObjects;

    for (i = 0; i < objects.length; i++) {

        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        item = UI.createListItem(canvas, "&nbsp;", objects[i]);
        item.click(selectFn(objects[i]));
        obj = new GameObject(objects[i]);

        if (objects[i] === currentObject) {
            item.click();
        }
        if (obj.hasBehavior("Renderable")) {
            try {
                w = obj.boundingBox.right - obj.boundingBox.left;
                h = obj.boundingBox.bottom - obj.boundingBox.top;
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
}

/**
 * Adds the background items to the menu.
 */
function initBackgrounds() {

    function selectFn(background) {
        return function() {
            GameState.setBackground(background);
        };
    }

    var i, w, h, bkg, canvas, ctx, item, backgrounds;

    backgrounds = config.editor.backgrounds;

    for (i = 0; i < backgrounds.length; i++) {
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        item = UI.createListItem(canvas, "&nbsp;", backgrounds[i]);
        item.click(selectFn(backgrounds[i]));
        bkg = new GameObject(backgrounds[i]);

        try {
            w = 64;
            h = 64;
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
}

/**
 * Adds music selection to the menu.
 */
function initMusic() {

    function selectFn(song) {
        return function() {
            console.log(song);
            GameState.setMusic(song);
            GameState.getMusic().play();
        };
    }

    config.editor.music.forEach(function(songName) {
        var item = UI.createListItem(null, "&nbsp;", songName),
            song = new GameObject("Audio", {
                name: songName
            });
        item.click(selectFn(song));
        UI.addListItem(item, "Music");
    });
}

/**
 * Pauses the game and adapts the GUI for editing.
 */
function enterEditMode() {
    $(canvas).removeClass("playing");
    GameController.pause();
    GameController.drawGrid(true);
    canvas.width = GameState.getWidth();
    canvas.height = GameState.getHeight();
    GameController.setCameraPosition(canvas.width / 2, canvas.height / 2);
    GameController.render();
}

/**
 * Starts the game and adapts the GUI for playing.
 */
function enterPlayMode() {
    $(canvas).addClass("playing");
    GameController.resume();
    GameController.drawGrid(false);
    canvas.width = config.windowWidth;
    canvas.height = config.windowHeight;
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

        var dropdown = $("#levelList"),
            i, opt;

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

UI.addCategory("Game Objects");
UI.addCategory("Backgrounds");
UI.addCategory("Music");

initGameObjects();
initBackgrounds();
initMusic();


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
                    selectedObject = new GameObject(currentObject);
                    GameState.addObject(selectedObject);
                }
                selectedObject.position = snapToGrid(p);
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
        GameController.render();
    })
    .mousemove(function(event) {

        var p = calculatePlacement(event);
        p = snapToGrid(p);

        if (selectedObject) {
            if (p.x !== selectedObject.position.x || p.y !== selectedObject.position.y) {
                selectedObject.position = p;
                GameController.render();
            }
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
