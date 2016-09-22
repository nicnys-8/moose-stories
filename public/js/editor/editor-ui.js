"use strict";

var UI = {};

UI.addCategory = function(name) {
    var clone = $("#menuCategoryPrototype").clone().removeClass("prototype").attr("id", ""),
        panelId = "menuCategory-" + name.replace(" ", "-");
    clone.find(".mcToggler").attr("href", "#" + panelId).text(name);
    clone.find(".mcToggler").text(name);
    clone.find(".mcToggled").attr("id", panelId);
    $("#menuCategories").append(clone);
};

UI.addListItem = function(item, categoryName) {
    var panelId = "#menuCategory-" + categoryName.replace(" ", "-");
    $(panelId).find(".media-list").append(item);
};

UI.createListItem = function(image, heading, text) {
    var clone = $("#menuListItemPrototype").clone().removeClass("prototype").attr("id", "");
    $(image).addClass("media-object");
    clone.find(".mc-media-container").append(image);
    clone.find(".media-heading").html(heading);
    clone.find(".media-body").append(text);
    return clone;
};

UI.createFormItem = function(object, key, callback, prefix) {

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
                    formGroup.append(UI.createFormItem(value, i, callback, name));
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
};

UI.createForm = function(obj, callback) {
    var form = $('<form role="form"></form>');
    for (var i in obj) {
        form.append(UI.createFormItem(obj, i, callback));
    }
    return form;
};

module.exports = UI;
