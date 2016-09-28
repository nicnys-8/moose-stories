/**
 * A collection of platform levels
 */

"use strict";

var Levels = {

    level1: {
        objects: [{
            name: "Player",
            x: 64,
            y: 112,
            uid: 1
        }],

        backgrounds: [{
                filePath: "img/backgrounds/sun.svg",
                x: 400,
                y: 100,
                tiledX: false,
                tiledY: false
            }, {
                filePath: "img/backgrounds/rainbow.svg",
                x: -350,
                y: 160,
                tiledX: false,
                tiledY: false
            }, {
                filePath: "img/backgrounds/mountains.svg",
                x: 0,
                y: 360,
                tiledX: true,
                tiledY: false
            }, {
                filePath: "img/backgrounds/clouds.svg",
                x: 0,
                y: -50,
                tiledX: true,
                tiledY: false
            }, {
                filePath: "img/backgrounds/controls.svg",
                x: 16,
                y: 16,
                tiledX: false,
                tiledY: false
            } // (HAXX)
        ],

        music: "audio/fnurk.mp3"
    }
};

/*
 * @TODO: Förstås ska det bara vara ett block för alla de här,
 * men än så länge följer inte grafiken med då man sätter width på objekt
 */
for (var i = 0; i < 12; i++) {
    Levels.level1.objects.push({
        name: "Block",
        x: 64 * i,
        y: 256,
        width: 64,
        height: 32
    });

    Levels.level1.objects.push({
        name: "Block",
        x: 256 * i,
        y: 224,
        width: 64,
        height: 32
    });
}

module.exports = Levels;
