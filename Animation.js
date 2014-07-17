function Animation(image, tpf, w, h, x, y) {
	var that = this;
	
	this.spriteSheet = image;
	this.active = false;
	this.width = w;
	this.height = h;
	this.x = x;
	this.y = y;
	this.rows = image.height / this.height;
	this.cols = image.width / this.width;
	this.loop = false;
	this.tpf = tpf; // ticks per frame
	this.frame = 0;
	this.ticks = 0;
	
	this.play = function() {
		that.active = true;
		that.ticks = 0;
		that.frame = 0;
	}
	
	this.stop = function() {
		that.active = false;
		that.ticks = 0;
		that.frame = 0;
	}
	
	this.update = function(dt) {
		if (!that.active) return;
		that.ticks++;
		if (that.ticks >= that.tpf) {
			that.ticks = 0;
			that.frame += 1;
		}
		
		if (that.frame >= that.rows * that.cols) {
			if (that.loop) that.frame = 0;
			else {
				that.frame = 0;
				that.active = false;
			}
		}
	}
	
	this.draw = function(ctx) {
		if (!that.active) return;
		ctx.drawImage(that.spriteSheet,
			Math.floor(that.frame % that.cols) * that.width,
			Math.floor(that.frame / that.cols) * that.height,
			that.width,
			that.height,
			this.x,
			this.y,
			that.width,
			that.height);
	}
	
}