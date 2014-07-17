function SceneManager(ctx) {
	var that = this;
	
	this.objects = [];

	this.update = function(dt) {
		for (var i = 0; i < that.objects.length; i++)
			that.objects[i].update(dt);
	}
	
	this.draw = function() {
		for (var i = 0; i < that.objects.length; i++)
			that.objects[i].draw(ctx);
	}
	
	this.register = function(obj) {
		that.objects.push(obj);
	}
}