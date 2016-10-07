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
        "Height": 10 * config.tileSize,
        //"Snap to grid": true
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
* @param {number} n Horizontal coordinate
* @return {number} The number closest to n that is evenly divisible by config.tileSize.
*/
function snapToGrid(n) {
    return config.tileSize * Math.floor(n / config.tileSize);
}

/**
 * Adds the background items to the menu.
 */
function setupBackgrounds() {

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
 * Adds the game object items to the menu.
 */
function setupObjects() { // Replace with ajax request

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

        canvas.width = GameState.getWidth();
        canvas.height = GameState.getHeight();
        GameController.setCanvas(canvas);
        GameController.startGame();
        GameController.pause();
        GameController.drawGrid(true);
    });

UI.addCategory("Game Objects");
UI.addCategory("Backgrounds");
UI.addCategory("Music");

setupBackgrounds();
setupObjects();


//===============
// Set up buttons
//===============

$("#clear-button").on("click", function() {
    selectedObject = null;
    GameState.clear();
});

$("#pause-button").on("click", function() {
    GameController.pause();
    GameController.drawGrid(true);
    canvas.width = GameState.getWidth();
    canvas.height = GameState.getHeight();
});

$("#play-button").on("click", function() {
    GameController.resume();
    GameController.drawGrid(false);
    canvas.width = config.windowWidth;
    canvas.height = config.windowHeight;
});


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
                    selectedObject = new GameObject(currentObject, {
                        position: {
                            x: snapToGrid(p.x),
                            y: snapToGrid(p.y)
                        }
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
            selectedObject.position.x = snapToGrid(p.x);
            selectedObject.position.y = snapToGrid(p.y);
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
