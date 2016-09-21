var GameState = require("./game-state"),
    GameController = require("./game-controller"),
    ObjectFactory = require("./objects/object-factory"),
    Camera = require("./camera"),
    Keyboard = require("./keyboard"),
    Levels = require("./levels"),
    AudioFactory = require("./audio-factory"),
    Background = require("./background"),
    canvas = document.getElementById("view"),
    state = new GameState(),
    camera = new Camera(),
    keyboard = new Keyboard(),
    gameController = new GameController(state, canvas, camera, keyboard),
    controlledCharacterUID = -1,
    audio = AudioFactory.createSound("audio/fnurk.mp3"),
    levels,
    currentLevelName = null;

// state.parseLevel(Levels.level1);

var UI = function() {

    function addCategory(name) {
        var clone = $("#menuCategoryPrototype").clone().removeClass("prototype").attr("id", ""),
            panelId = "menuCategory-" + name.replace(" ", "-");
        clone.find(".mcToggler").attr("href", "#" + panelId).text(name);
        clone.find(".mcToggler").text(name);
        clone.find(".mcToggled").attr("id", panelId);
        $("#menuCategories").append(clone);
    }

    function addListItem(item, categoryName) {
        var panelId = "#menuCategory-" + categoryName.replace(" ", "-");
        $(panelId).find(".media-list").append(item);
    }

    function createListItem(image, heading, text) {
        var clone = $("#menuListItemPrototype").clone().removeClass("prototype").attr("id", "");
        $(image).addClass("media-object");
        clone.find(".mc-media-container").append(image);
        clone.find(".media-heading").html(heading);
        clone.find(".media-body").append(text);
        return clone;
    }

    function createFormItem(object, key, callback, prefix) {

        var value = object[key],
            type = typeof(value),
            name = prefix ? (prefix + "." + key) : key,
            formGroup = $('<div class="form-group"></div>'),
            label = $('<label>' + name + '</label>'), // '<label for="' + id + name + '">'
            convertFn,
            input, i;

        switch (type) {
            case "string":
                input = $('<input type="text" class="form-control" value="' + value + '" />');
                formGroup.append(label);
                formGroup.append(input);
                convertFn = function(src) {
                    return "" + src.value;
                };
                break;
            case "number":
                input = $('<input type="number" class="form-control" value=' + value + ' />');
                formGroup.append(label);
                formGroup.append(input);
                convertFn = function(src) {
                    return +src.value || 0;
                };
                break;
            case "boolean":
                formGroup = $('<div class="checkbox"></div>');
                label = $('<label></label>');
                input = $('<input type="checkbox" ' + ((value) ? 'checked' : '') + ' />');
                formGroup.append(label);
                formGroup.append(input);
                formGroup.append(name);
                convertFn = function(src) {
                    return !!src.checked;
                };
                break;
            case "object":
                if ($.isArray(value)) {
                    input = $('<select multiple class="form-control"></select>');
                    for (i in value) {
                        input.append($('<option>' + value[i] + '</option>'));
                    }
                    formGroup.append(label);
                    formGroup.append(input);
                } else {
                    // return createForm(value, callback);
                    for (i in value) {
                        formGroup.append(createFormItem(value, i, callback, name));
                    }
                }
                return formGroup;
            default:
                return null;
        }

        input.change(function() {
            object[key] = convertFn(this);
            if (callback) {
                callback(name, object[key]);
            }
        });

        return formGroup;
    }

    function createForm(obj, callback) {
        var form = $('<form role="form"></form>');
        for (var i in obj) {
            form.append(createFormItem(obj, i, callback));
        }
        return form;
    }

    return {
        addCategory: addCategory,
        addListItem: addListItem,
        createListItem: createListItem,
        createForm: createForm
    };
}();

UI.addCategory("Game Objects");
UI.addCategory("Sprites");
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
    "Width": 800,
    "Height": 600,
    "Snap to grid": true,
    "Grid size x": 32,
    "Grid size y": 32
};

// $("#sidebar-left").append(UI.createForm(testObj));
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
    // state.clear();empty();?
    $("#newLevelModal").modal({
        backdrop: "static"
    }); // options)
    // $("#newLevelModal").find(".modal-body").append(UI.createForm(testObj));
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

$.get("/sprites",
    function(data) {
        var img, item, i;
        for (i in data) {
            img = new Image();
            img.src = data[i];
            item = UI.createListItem(img, "&nbsp;", data[i]);
            UI.addListItem(item, "Sprites");
        }
    });

$.get("/backgrounds",
    function(data) {

        var selectedBackground = null,
            bgPath = null;

        function selectFn(name) {
            return function() {
                if (selectedBackground) {
                    selectedBackground.style.backgroundColor = "";
                }
                this.style.backgroundColor = "#eee";
                selectedBackground = this;
                bgPath = name;
                console.log(bgPath);
            };
        }

        var img, item, i, clone;
        var list = $("#newBackgroundModal").find(".modal-body-left ul");
        for (i in data) {
            img = new Image();
            img.src = data[i];

            clone = $("#backgroundListItemPrototype").clone().removeClass("prototype").attr("id", "");
            $(img).addClass("media-object");
            clone.find(".mc-media-container").append(img);
            clone.find(".media-heading").html("&nbsp;");
            clone.find(".media-body").append(data[i]);
            clone.click(selectFn(data[i]));
            list.append(clone);
            // item = UI.createListItem(img, "&nbsp;", data[i]);
            // UI.addListItem(item, "Backgrounds");
        }
        var settings = {
            x: 0,
            y: 0,
            tiledX: false,
            tiledY: false
        };
        $("#newBackgroundModal")
            .find(".modal-body-right")
            .append(UI.createForm(settings));
        $("#newBackgroundModal")
            .find(".saveButton")
            .click(function() {
                if (bgPath) {
                    settings.filePath = bgPath;
                    state.addBackground(new Background(settings));
                    $("#newBackgroundModal").modal("hide");
                }
            });
        $("#newBackgroundModal").modal({
            backdrop: "static"
        });
    });


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


//=====================
// Handle mouse presses
//=====================

var newObject = null;

function calculatePlacement(event) {
    var x = camera.x + event.offsetX - canvas.width / 2,
        y = camera.y + event.offsetY - canvas.height / 2,
        snap = levelSettings["Snap to grid"], // blää
        snapX = levelSettings["Grid size x"],
        snapY = levelSettings["Grid size y"];
    return {
        x: snap ? (snapX * Math.round(x / snapX)) : Math.round(x),
        y: snap ? (snapY * Math.round(y / snapY)) : Math.round(y)
    };
}

$("#view")
    .mousedown(function(event) {

        var p = calculatePlacement(event);

        newObject = ObjectFactory.createObject({
            name: currentClass,
            x: p.x,
            y: p.y,
        });

        // $("#sidebar-left").prepend(UI.createForm(block));
        state.addObject(newObject);
    })
    .mousemove(function(event) {

        var p = calculatePlacement(event);

        if (newObject) {
            newObject.x = p.x;
            newObject.y = p.y;
        }

        $("#mouseX").text(p.x);
        $("#mouseY").text(p.y);

    })
    .bind("mouseup mouseleave mouseout", function(event) {
        newObject = null;
    });
