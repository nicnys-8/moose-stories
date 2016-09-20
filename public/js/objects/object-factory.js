"use strict";

/**
A thing for creating things... GAH!
Näämen, den här borde döpas om eller nå.
Alla spelobject sätts fast på den här, t.ex. ObjectFactory.Moving;
det gör att man kan parsa banor lite snyggare i gamestate,
då alla objekttyper kan accessas som properties på det här objektet
*/
var Behaviors = require("./../behaviors");

module.exports = {

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

    classes: {},
    baseClass: null,

    defineBaseClass: function(name, constructor) {
        // TODO: Add defaults and stuff here as well
        if (this.baseClass) {
            throw "Trying to overwrite base class " + this.baseClass + " with class " + name + ". Aborting!";
        }
        this.baseClass = name;
        this.classes[name] = constructor;
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

        if (!this.baseClass) {
            throw "The base class is undefined, please do that first!!!!!:D";
        }
        if (this.classes[name]) {
            throw "Trying to redefine class " + name + ". Aborting!";
        }

        var defaults = definition.defaults || {},
            behaviors = definition.behaviors || [],
            initFn = definition.init || NOOP,
            tick = definition.tick,
            superClass = definition.superClass || this.baseClass,
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
                this.addBehavior(Behaviors[behaviors[i]]);
            }

            if (tick) {
                this.addBehavior(tick);
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
