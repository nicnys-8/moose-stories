/**
 * A collection of platform levels
 */

"use strict";

var uid = 0;
var Levels = {

    level1: {
        objects: [{
            behaviors: "Player",
            args: {
                position: {
                    x: 64,
                    y: 112
                },
                uid: uid++
            }
        }],
        background: "DefaultBackground",
        music: "audio/fnurk.mp3"
    }
};

/*
 * @TODO: Förstås ska det bara vara ett block för alla de här,
 * men än så länge följer inte grafiken med då man sätter width på objekt
 */
for (var i = 0; i < 12; i++) {
    Levels.level1.objects.push({
        behaviors: "Block",
        args: {
            position: {
                x: 64 * i,
                y: 256
            },
            width: 64,
            height: 32,
            uid: uid++
        }
    });

    Levels.level1.objects.push({
        behaviors: "Block",
        args: {
            position: {
                x: 256 * i,
                y: 224
            },
            width: 64,
            height: 32,
            uid: uid++
        }
    });
}

module.exports = Levels;
