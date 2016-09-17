/**
A background image object
*/
var skam = 0;
function Background(args) {

	//==================
	// Private variables
	//==================
    
    var imgPath = (args + "" === args) ? args : args.filePath;
	var canvas = document.createElement("canvas"); //@TODO: Cash canvases CASH!?! :D
	var img = new Image();

    img.onload = function() {
		canvas.width = img.width;
		canvas.height = img.height;
		canvas.getContext("2d").drawImage(img, 0, 0);
	};
	img.src = imgPath;

	//===========
	// Public API
	//===========

	this.x = +args.x || 0;
	this.y = +args.y || 0;
	this.tiledX = !!args.tiledX;
	this.tiledY = !!args.tiledY;
	
	this.scale = {x: 1, y: 1};
	this.rotation = 0;
	this.parallax = 1;
	this.alpha = 1;

    this.exportJSON = function() {
        return {
            filePath : imgPath,
            x : this.x,
            y : this.y,
            tiledX : this.tiledX,
            tiledY : this.tiledY
            // ...
        }
    };
    
	/**
	Renders the background on screen
	@param ctx 2D rendering context
	*/
	this.render = function(ctx) {
		var width = canvas.width;
		var height = canvas.height;
		var clippingX = 0;
		var clippingY = 0;
		var startX = (this.tiledX) ?  (-width + this.x) : this.x;
		var startY = (this.tiledY) ?  (-height + this.y) : this.y;
		var xTiles = (this.tiledX) ? (Math.ceil(ctx.canvas.clientWidth / width) + 1) : 1;
		var yTiles = (this.tiledY) ? (Math.ceil(ctx.canvas.clientHeight / height) + 1) : 1;
		var i, j;

		ctx.save();
		ctx.scale(this.scale.x, this.scale.y);
		ctx.rotate(this.rotation);
		ctx.globalAlpha = this.alpha; 
		ctx.translate(startX, startY);

		for (i = 0; i < xTiles; i++) {
			for (j = 0; j < yTiles; j++) {
				ctx.drawImage(
				canvas,
				clippingX, clippingY,
				width, height, // Clipping size
				i * width, j * height,
				width, height
				);
			}
		}

		ctx.restore();
	};

}
