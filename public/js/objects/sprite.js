"use strict";

var ObjectFactory = require("./object-factory");

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
    ctx.fillStyle = "red";
    ctx.restore();
}


/**
 * Creates an instance of a sprite object. A sprite can be rendered on screen,
 * consisting of an arbitrary number of frames of equal size
 *
 * @constructor
 *
 * @this {Sprite}
 * @param {string} imgPath Path to the image file.
 * @param {number} numFrames The number of frames of the animation
 * @param {number} width Width of each frame
 * @param {number} height Height of each frame
 * @param {object} hotspot Anchorpoint of the sprite relative to the upper corner of each frame, e.g. {x: 8, y: 8}
 */


//=========================
// Register the object type
//=========================

ObjectFactory.defineClass("Sprite", {
    behaviors: ["Renderable", "LoadImage"],
    init: function(args) {
        this.render = render; //Change this!!!
        this.canvas = this.loadImage(args.imgPath);
        this.numFrames = args.numFrames || 1;
        this.hotspot = {
            x: args.hotspot ? args.hotspot.x : 0,
            y: args.hotspot ? args.hotspot.y : 0,
        };
        this.currentFrame = 0;
        this.imageSpeed = args.imageSpeed || 0;
    },
    /*defaults: {

    },*/
    tick: function() {
        this.currentFrame = (this.currentFrame + this.imageSpeed) % (this.numFrames - 1);
    },
});
