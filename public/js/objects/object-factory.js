/**
* Factory singleton that handles registering of game object types.
*/

"use strict";

var GameObject = require("./game-object");

module.exports = {
    classes: {
        "GameObject": GameObject
    },

    // Nåt sånt här kan man också ha, men då måste vi skriva om
    // konstruktÖrerna så att de tar alla parametrar i ett objekt.
    // Alternativt {name:"Nånting", params:{...}}
    createObject: function(description) {
        var constr = this.classes[description.name] || this[description.name],
            object = null;
        if (constr) {
            object = new constr(description);
        } else {
            console.warn("Trying to create unknown object " + description.name);
        }
        return object;
    },

    /**
     JAJA, jag kommenterar det här sen!! :P
     */
    defineClass: function(name, definition) {

        function NOOP() {}

        function mergeArgs(primary, secondary) {
            primary = primary || {};
            for (var i in secondary) {
                if (typeof secondary[i] === "object") {
                    primary[i] = mergeArgs(primary[i], secondary[i]);
                } else if (!primary.hasOwnProperty(i)) {
                    primary[i] = secondary[i];
                }
            }
            return primary;
        }

        if (this.classes[name]) {
            throw "Trying to redefine class " + name + ". Aborting!";
        }

        var defaults = definition.defaults || {},
            behaviors = definition.behaviors || [],
            initFn = definition.init || NOOP,
            tick = definition.tick,
            superClass = definition.superClass || GameObject,
            superConstr = this.classes[superClass],
            prototype = definition.prototype, // Add more stuff to the prototype (confusing with superClass and prototype?? Maybe let the 'superClass' argument be any object instead of just a string?)
            constr, i;

        if (!superConstr) {
            throw "Gah! Superclass " + superClass + " not found!";
        }

        constr = function(args, defaultsFromSubclass) {

            defaults = mergeArgs(defaultsFromSubclass, defaults);
            args = mergeArgs(args, defaults);

            superConstr.call(this, args, defaults);

            for (var i = 0; i < behaviors.length; i++) {
                this.addBehavior(behaviors[i]);
            }

            if (tick) {
                this.addTick(tick);
            }

            initFn.call(this, args, defaults);

            this.exportJSON = function() {
                // This should be enough to recreate the object... Sometimes :)
                var json = {
                        "name": name
                    },
                    i;

                for (i in args) {
                    json[i] = this[i] || args[i];
                }
                return json;
            };
        };

        constr.prototype = new superConstr(); // new superConstr(defaults);?
        if (prototype) {
            for (i in prototype) {
                constr.prototype[i] = prototype[i];
            }
        }

        this.classes[name] = constr;
    }

};
