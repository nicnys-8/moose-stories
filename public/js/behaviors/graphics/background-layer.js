/**
 * Describes an animated object.
 */

"use strict";

var Behaviors = require("../../behaviors");

 /**
 * Renders the background layer on screen.
 *
 * @param {CanvasRenderingContext2D} ctx 2D rendering context.
 */
 function render(ctx) {
     var width = this.canvas.width,
         height = this.canvas.height,
         startX = (this.tiledX) ? (-width + this.x) : this.x,
         startY = (this.tiledY) ? (-height + this.y) : this.y,
         xTiles = (this.tiledX) ? (Math.ceil(ctx.canvas.clientWidth / width) + 1) : 1,
         yTiles = (this.tiledY) ? (Math.ceil(ctx.canvas.clientHeight / height) + 1) : 1,
         i, j;

     ctx.save();
     ctx.scale(this.scale.x, this.scale.y);
     ctx.rotate(this.rotation);
     ctx.globalAlpha = this.alpha;
     ctx.translate(startX, startY);

     for (i = 0; i < xTiles; i++) {
         for (j = 0; j < yTiles; j++) {
             ctx.drawImage(
                 this.canvas,
                 0, 0,
                 width, height,
                 i * width, j * height,
                 width, height
             );
         }
     }
     ctx.restore();
 }


//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Renderable", "LoadImage"];

/**
* Returns the public variables and methods associated with this behavior.
* @return {object} An object containing behavior variables and methods.
*/
behavior.getProperties = function() {
    return {
        // Variables
        canvas: null,
        tiledX: false,
        tiledY: false,
        parallax: {
            x: 0,
            y: 0
        },

        // Functions
        render: render
    };
};

/**
* Initialization function, called on an object when this behavior is added to it.
*
* @param {string} args.imagePath Path to the image file.
*/
behavior.init = function(args) {
    if (args && args.imagePath) {
        this.canvas = this.loadImage(args.imagePath);
    } else {
      throw new Error("'BackgroundLayer' behavior requires argument 'imagePath'.");
    }
};

Behaviors.register("BackgroundLayer", behavior);
