/**
 * Describes an animated object.
 */

"use strict";

var Behaviors = require("../behaviors");
var skam;

/**
 * Renders the sprite on screen.
 *
 * @param {CanvasRenderingContext2D} ctx 2D rendering context.
 * @param {number} x The horizontal position on the context where the sprite will be rendered.
 * @param {number} y The vertical position on the context where the sprite will be rendered.
 * @param {object} scale Scale of the sprite, e.g. {x: 1, y: 2}.
 * @param {number} rotation The sprite's rotation in radians.
 * @param {number} alpha Opacity of the object, a value between 0 and 1.
 */
function render(ctx, x, y, scale, rotation, alpha) {
    var width = this.canvas.width / this.numFrames,
        height = this.canvas.height,
        clippingX = Math.round(this.currentFrame) * width,
        clippingY = 0,
        canvasX = -this.hotspot.x / Math.abs(scale.x),
        canvasY = -this.hotspot.y / Math.abs(scale.y);

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale.x, scale.y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;

    ctx.drawImage(
        this.canvas,
        clippingX, clippingY,
        width, height, // Clipping size
        canvasX, canvasY,
        width, height
    );
    ctx.restore();
}


require("./renderable"); // FIXME!
require("./load-image"); // FIXME!
//=================
// Public interface
//=================

var behavior = {};

behavior.dependencies = ["Renderable", "LoadImage"];

behavior.getProperties = function() {
    return {
        // Variables
        canvas: null,
        numFrames: 1,
        hotspot: {
            x: 0,
            y: 0,
        },
        currentFrame: 0,
        imageSpeed: 0,

        // Functions
        render: render
    };
};

/**
* Initialization function, called on an object when this behavior is added to it.
*
* @param {string} args.imgPath Path to the image file.
*/
behavior.init = function(args) {
    if (args && args.imgPath) {
        this.canvas = this.loadImage(args.imgPath);
    } else {
      throw new Error("Sprite behavior requires argument 'imgPath'.");
    }
};

behavior.tick = function() {
    this.currentFrame = (this.currentFrame + this.imageSpeed) % (this.numFrames - 1);
};

Behaviors.register("Sprite", behavior);
