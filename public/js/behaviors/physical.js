/**
Describes the behavior of a physical object
*/
Behavior.Physical = Behavior.Physical || function() {

    //================================
    // Private functions and variables
    //================================

    // @TODO: Rename functions to specifiy whether they work with objects or other things. e.g. overlapsObjectOffset ??? (note: this is a question)


    /**
    Check whether this object overlaps another.
    @param obj The object to check for overlap with
    @return true if an overlap was detected, false otherwise
    */
    function overlapsObject(obj) {
        return this.overlapsAtOffset(obj, 0, 0);
    }

    /**
    Check whether this object would overlap another if it was moved
    to a specified point.
    @param obj The object to check for overlap with
    @param offsetX The horizontal distance to check
    @param offsetY The vertical distance to check
    @return true if an overlap was detected, false otherwise
    */
    function overlapsAtOffset(obj, offsetX, offsetY) {
        return !(
            this.x + offsetX + this.boundingBox.left >= obj.x + obj.boundingBox.right ||
            this.x + offsetX + this.boundingBox.right <= obj.x + obj.boundingBox.left ||
            this.y + offsetY + this.boundingBox.top >= obj.y + obj.boundingBox.bottom ||
            this.y + offsetY + this.boundingBox.bottom <= obj.y + obj.boundingBox.top
        );
    }

    /**
    Check whether this object overlaps a point.
    @param x x-position of point
    @param y y-position of point
    @return true if an overlap was detected, false otherwise
    */
    function overlapsPoint(x, y) {
        return !(
            this.x + this.boundingBox.left >= x ||
            this.x + this.boundingBox.right <= x ||
            this.y + this.boundingBox.top >= y ||
            this.y + this.boundingBox.bottom <= y
        );
    }

    /**
    Check by how much this objects overlaps another along a specified
    coordinate.
    @param obj The object to check for collisions with
    @param coordinate The coordinate along which check
    @return The amount of overlap
    */
    function overlapsBy(obj, coordinate) {
        switch (coordinate) {
            case "x":
                boundingBoxVar1 = "left"
                boundingBoxVar2 = "right"
                break;
            case "y":
                boundingBoxVar1 = "top"
                boundingBoxVar2 = "bottom"
                break;
            default:
                throw new Error("Not a valid coordinate.");
                break;
        }
        if (this[coordinate] < obj[coordinate]) {
            return this[coordinate] + this.boundingBox[boundingBoxVar2] - (obj[coordinate] + obj.boundingBox[boundingBoxVar1])
        } else {
            return this[coordinate] + this.boundingBox[boundingBoxVar1] - (obj[coordinate] + obj.boundingBox[boundingBoxVar2])
        }
    }

    //@TODO: horizontalOverlap and verticalOverlap are deprecated. Use overlapsby instead. Remove all uses of the deprected functions.

    function horizontalOverlap(obj) {
        console.warn("Deprecated function");
        if (this.x < obj.x) {
            return (this.x + this.boundingBox.right) - (obj.x + obj.boundingBox.left);
        } else {
            return (this.x + this.boundingBox.left) - (obj.x + obj.boundingBox.right);
        }
    }

    function verticalOverlap(obj) {
        console.warn("Deprecated function");
        if (this.y < obj.y) {
            return (this.y + this.boundingBox.bottom) - (obj.y + obj.boundingBox.top);
        } else {
            return (this.y + this.boundingBox.top) - (obj.y + obj.boundingBox.bottom);
        }
    }

    /**
    Returns true if the object is standing on the other one
    */
    function onTopOf(obj) {
        return (!(this.x + this.boundingBox.left >= obj.x + obj.boundingBox.right ||
                this.x + this.boundingBox.right <= obj.x + obj.boundingBox.left) &&
            this.y + this.boundingBox.bottom === obj.y + obj.boundingBox.top);
    }


    //=================
    // Public interface
    //=================

    var behavior = {};

    behavior.name = "Physical";

    behavior.getProperties = function() {
        return {
            // variables
            x: 0,
            y: 0,
            weight: 1,
            boundingBox: null, // e.g. {left: -8, right: 8, top: -8, bottom: 8}
            onGround: true,
            wasOnGround: true,

            // Functions
            overlapsObject: overlapsObject,
            overlapsAtOffset: overlapsAtOffset,
            overlapsPoint: overlapsPoint,
            overlapsBy: overlapsBy,
            horizontalOverlap: horizontalOverlap,
            verticalOverlap: verticalOverlap,
            onTopOf: onTopOf
        };
    };

    behavior.tick = function(gameState) {
        var solids = gameState.filter("Solid"),
			i;

        this.wasOnGround = this.onGround;
        this.onGround = false;

        for (i = 0; i < solids.length; i++) {
            if (this.onTopOf(solids[i])) {
                this.onGround = true;
            }
        }
    };

    return behavior;
}();
