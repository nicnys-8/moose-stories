var GameState = require("./../game-state"),
    GameController = require("./../game-controller"),
    ObjectFactory = require("./../objects/object-factory"),
    Camera = require("./../camera"),
    Keyboard = require("./../keyboard"),
    Levels = require("./../levels"),
    AudioFactory = require("./../audio-factory"),
    Background = require("./../background"),
    config = require("./../config"),
    canvas = document.getElementById("view"),
    state = new GameState(),
    camera = new Camera(),
    keyboard = new Keyboard(),
    gameController = new GameController(state, canvas, camera, keyboard),
    controlledCharacterUID = -1,
    audio = AudioFactory.createSound("audio/fnurk.mp3"),
    levels,
    currentLevelName = null;

var UI = require("./editor-ui");

UI.addCategory("Game Objects");
UI.addCategory("Backgrounds");
UI.addCategory("Music");

var testObj = {
    x: 1,
    y: true,
    bbox: {
        left: 5,
        top: {
            e: 1,
            oo: [1, 2, 3, "hehe"]
        }
    },
    huu: "hehe"
};

var levelSettings = {
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

function createNewLevel() {
    state.clear();
}

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
            state.parseLevel(levels[currentLevelName]);
        } else {
            createNewLevel();
        }

        //====================
        // Start the game loop
        //====================
        gameController.startGame();
    });

$.get("/backgrounds",
    function(data) {});


var currentClass = "Block",
    selectedButton = null;

setTimeout(function() {

    function selectFn(name) {
        return function() {
            if (selectedButton) {
                selectedButton.style.backgroundColor = "";
            }
            this.style.backgroundColor = "#eee";
            currentClass = name;
            selectedButton = this;
        };
    }

    var i, w, h, obj, canvas, ctx, item;

    for (i in ObjectFactory.classes) {

        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        item = UI.createListItem(canvas, "&nbsp;", i);
        item.click(selectFn(i));
        obj = ObjectFactory.createObject({
            name: i,
            x: 0,
            y: 0
        });

        if (i == currentClass) {
            item.click();
        }

        if (obj.hasBehavior("Renderable") && obj.currentSprite) {
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
    state.clear();
});

$("#pause-button").on("click", function() {
    gameController.pause();
});

$("#play-button").on("click", function() {
    gameController.resume();
});

//=====================
// Handle mouse presses
//=====================

var selectedObject = null;

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

$("#view")
    .mousedown(function(event) {
        var p = calculatePlacement(event),
            leftMouseButton = 1,
            middleMouseButton = 2,
            rightMouseButton = 3;

        event.preventDefault();
        selectedObject = state.objectAtPosition(p.x, p.y);

        switch (event.which) {
            case leftMouseButton:
                if (!selectedObject) {
                    selectedObject = ObjectFactory.createObject({
                        name: currentClass,
                        x: p.x,
                        y: p.y,
                    });
                    state.addObject(selectedObject);
                }
                break;
            case middleMouseButton:
                break;
            case rightMouseButton:
                if (selectedObject) {
                    state.removeObject(selectedObject);
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
            state.removeObject(selectedObject);
        }
        selectedObject = null;
    });

// Disable the context menu that appears on right click on the canvas
$('body').on('contextmenu', '#view', function(e) {
    return false;
});
