"use strict";

/**
Constructor of a sprite object. A sprite is an object that can be
rendered on screen, consisting of an arbitrary number of frames
of equal size
@param Canvas A Canvas object containing the animation frames
@param numFrames The number of frames of the animation
@param width Width of each frame
@param height Height of each frame
@param hotspot Anchorpoint of the sprite relative to
the upper corner of each frame, e.g. {x: 8, y: 8}
*/
function Sprite(canvas, numFrames, hotspot) {

    //=================
    // Public variables
    //=================

    this.numFrames = numFrames;
    this.hotspot = hotspot;
    this.currentFrame = 0;
    this.imageSpeed = 0;


    //=================
    // Public functions
    //=================

    /**
    Action to perform at each iteration of the game loop
    */
    this.tick = function() {
        this.currentFrame = (this.currentFrame + this.imageSpeed) % (this.numFrames - 1);
    };

    /**
    Renders the sprite on screen
    @param ctx 2D rendering context
    @param x, y The position on the context where this will be rendered
    @param scale Scale of the sprite, e.g. {x: 1, y: 2}
    @param rotation The sprite's rotation in radians
    @param	alpha Opacity of the object, a value between 0 and 1
    */
    this.render = function(ctx, x, y, scale, rotation, alpha) {
        var width = canvas.width / this.numFrames,
            height = canvas.height,
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
            canvas,
            clippingX, clippingY,
            width, height, // Clipping size
            canvasX, canvasY,
            width, height
        );
        ctx.fillStyle = "red";
        ctx.restore();
    };
}

module.exports = Sprite;
