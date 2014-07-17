function Game(canvas, ctx) {
	var that = this;

	this.tetris = new Tetris(ctx);
	this.animation = new Animation($("#animation")[0], 4, 200, 100, that.tetris.MARGIN_LEFT, 300);
	this.startScreen = new Animation($("#startScreen")[0], 60, 200, 400, that.tetris.MARGIN_LEFT, that.tetris.MARGIN_TOP);
	this.startScreen.loop = true;
	this.gameOver = new Animation($("#gameOver")[0], 60, 200, 400, that.tetris.MARGIN_LEFT, that.tetris.MARGIN_TOP);
	this.gameOver.loop = true;
	
	this.smgr = new SceneManager(ctx);
	this.smgr.register(this.animation);
	this.smgr.register(this.startScreen);
	this.smgr.register(this.gameOver);
	
	this.width = canvas.width;
	this.height = canvas.height;
	this.FPS = 60;
	
	this.state = {
		options: {
			showStats: false
		},
		
		canHold: true,
		level: 1,
		score: 0,
		lastDrop: 0,
		timeElapsed: 0,
		linesCleared: 0,
		gameState: "startScreen"
	}
	
	this.player = {
		tetromino: tets[Math.floor(Math.random()*tets.length)],
		rotation: 0,
		r: 0, // starting positions
		c: 3, // middle of the screen
		heldPiece: 0, // nothing
		nextPiece: tets[Math.floor(Math.random()*tets.length)]
	}
	

	// dt = delta time (change in time)
	// is in milliseconds
	this.update = function (dt) {
		if (that.state.gameState === "play") {
			that.framerate = Math.floor(1000.0 / dt);
			that.state.timeElapsed += dt; // timeElapsed will not increase even if we are paused!
			// difficulty formula: 1+ log(level)
			if (that.state.timeElapsed >= 1000/(1 + Math.log(that.state.level))) {
				if (!that.canMoveR(1)) {
					that.merge();
					that.playerSpawn();
				} else {
					that.player.r += 1;
				}
				that.state.lastDrop = 0;
				that.state.timeElapsed = 0;
			
			}
			// check if game is over
			if (!that.tetris.rowEmpty(0))
				that.state.gameState = "gameOver";
		} else if (that.state.gameState === "startScreen") {
			if (!that.startScreen.active) that.startScreen.play();
		} else if (that.state.gameState === "gameOver") {
			if (!that.gameOver.active) that.gameOver.play();
		}
		
		that.smgr.update(dt);
	}

	var frame = $("#frame")[0];
	this.draw = function () {
		ctx.clearRect(0, 0, that.width, that.height);
		
		ctx.drawImage(frame, 0, 0, frame.width, frame.height);
		that.tetris.draw();
		
	
		if (that.state.gameState === "startScreen") {
			// do nothing -- SceneManager will draw the animation
			// (SceneManager) draws the other animations on the screen.
			// Might think about making the Tetris board an entity managed
			// by the SceneManager.
		} else if (that.state.gameState === "play") {
			// why paused ? because we will show the game in the background on the pause screen.
			// that.tetris.drawAnnotations(); -- uncomment if you want to see rows & cols
			
			var drop = 0;
			while (that.canMoveR(++drop)) {
				// do nothing
			}
			
			that.tetris.drawGhost(that.player.r+drop-1,
				that.player.c,
				that.player.tetromino,
				that.player.rotation);
			
			that.tetris.drawTetromino(that.player.r,
				that.player.c,
				that.player.tetromino,
				that.player.rotation);
		}

		that.smgr.draw();
		
		// draw lines cleared
		ctx.textAlign = "center";
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "18px sans-serif";
		ctx.fillText(that.state.linesCleared, 108, 480);
		
		// draw score
		ctx.fillText(that.state.score, 435, 350);
		
		// hold
		that.tetris.drawPreview(75, 169, that.player.heldPiece);
		
		// next
		that.tetris.drawPreview(387, 169, that.player.nextPiece);
	}

	
	
	this.onKeyDown = function (event) {
		if (that.state.gameState === "play") {
			switch (event.keyCode) {
				case 37: // LEFT
					event.preventDefault();
					if (that.canMoveC(-1)) that.player.c -= 1;
					break;
				case 39: // RIGHT
					event.preventDefault();
					if (that.canMoveC(1)) that.player.c += 1;
					break;
				case 38: // UP
					event.preventDefault();
					// Cycle through the matrices
					if (that.canRotate()) that.player.rotation = (that.player.rotation + 1) % 4;
					break;
				case 40: // DOWN
					event.preventDefault();
					if (that.canMoveR(1)) that.player.r += 1;
					break;
				case 32: // SPACE
					event.preventDefault();
					while (that.canMoveR(1)) {
						that.player.r += 1;
					}
					
					that.merge();
					that.playerSpawn();
					that.state.lastDrop = 0;
					that.state.timeElapsed = 0;

					break;
				case 16: // SHIFT
					event.preventDefault();
					if (that.state.canHold) {
						var piece = that.player.heldPiece;
						that.player.heldPiece = that.player.tetromino;
						if (piece == 0)
							that.playerSpawn();
						else {
							that.player.tetromino = piece;
							that.player.rotation = 0;
							that.player.r = 0;
							that.player.c = 3;
						}
						that.state.canHold = false;
					}
					break;
				case 80: // P
					event.preventDefault();
					that.state.gameState = "startScreen";
					that.startScreen.play();
					break;
			}
		} else if (that.state.gameState === "startScreen") {
			switch (event.keyCode) {
				case 32: // SPACE
					event.preventDefault();
					that.state.gameState = "play";
					that.startScreen.stop();
					break;
			}
		} else if (that.state.gameState === "gameOver") {
			switch (event.keyCode) {
				case 80: // SPACE
					event.preventDefault();

					that.tetris = new Tetris(ctx);
					
					that.player.tetromino = tets[Math.floor(Math.random()*tets.length)];
					that.player.rotation = 0;
					that.player.r = 0;
					that.player.c = 3;
					that.player.nextPiece =  tets[Math.floor(Math.random()*tets.length)];
					
					that.state = {
						options: {
							showStats: false
						},
						
						canHold: true,
						level: 1,
						score: 0,
						lastDrop: 0,
						timeElapsed: 0,
						linesCleared: 0,
						gameState: "play"
					}
					
					that.gameOver.stop();
					
					break;
					
					
			}
		}
	}
	
	// Can we move (dr) many rows ?
	this.canMoveR = function(dr) {
		return (that.tetris.tInBounds(that.player.r+dr, that.player.c, that.player.tetromino, that.player.rotation)
			&& !that.tetris.tIntersect(that.player.r+dr, that.player.c, that.player.tetromino, that.player.rotation))
	}
	
	// Can we move (dc) many columns ?
	this.canMoveC = function(dc) {
		return (that.tetris.tInBounds(that.player.r, that.player.c+dc, that.player.tetromino, that.player.rotation)
			&& !that.tetris.tIntersect(that.player.r, that.player.c+dc, that.player.tetromino, that.player.rotation))
	}
	
	this.canRotate = function() {
		return (that.tetris.tInBounds(that.player.r, that.player.c, that.player.tetromino, (that.player.rotation + 1) % 4)
			&& !that.tetris.tIntersect(that.player.r, that.player.c, that.player.tetromino, (that.player.rotation + 1) % 4))
	}
	
	this.merge = function() {
		that.tetris.tMerge(that.player.r, that.player.c, that.player.tetromino, that.player.rotation);
		
		var lines = that.tetris.clearLines();
		that.state.linesCleared += lines;
		that.state.score += 10 * lines*lines;
		
		if (lines == 4) { // TETRIS !!
			that.animation.play();
			that.state.score += 40;
		}
		
		if (that.state.linesCleared > that.state.level*5) that.state.level++;
		that.state.canHold = true;
	}
	
	this.playerSpawn = function() {
		that.player.tetromino = that.player.nextPiece;
		that.player.rotation = 0;
		that.player.r = 0;
		that.player.c = 3;
		that.player.nextPiece =  tets[Math.floor(Math.random()*tets.length)];
	}
	
	var lastTime = 0;
	
	this.start = function () {
		// attach events to the Game
		window.addEventListener('keydown', that.onKeyDown);
		lastTime = Date.now();
		
		var stats = new Stats();
		stats.setMode(0); // 0: fps, 1: ms

		// Align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		document.body.appendChild( stats.domElement );

		setInterval( function () {

			stats.begin();
			that.run();
			stats.end();

		}, 1000 / that.FPS );

	}
	
	this.run = function () {
		that.update(Date.now() - lastTime);
		that.draw();
		lastTime = Date.now();
	}
	
	this.drawPreview = function(x, y, tetromino) {
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
		for (var r = 0; r < 4; r++) // For each row
			for (var c = 0; c < 4; c++) { // For each column
				// Stroke (outline) a rectangle of size 20x20
				ctx.strokeRect(x + c*that.SIZE,
					y + r*that.SIZE,
					that.SIZE,
					that.SIZE);
					
				if ((r+c) % 2 == 0) { // checkered pattern
					ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
					ctx.fillRect(x + c*that.SIZE,
						y + r*that.SIZE,
						that.SIZE,
						that.SIZE);
				}
			}
		
		if (tetromino != 0) {
			for (var r = 0; r < 4; r++) // For each row
				for (var c = 0; c < 4; c++) { // For each column
					if (tetromino.preview[r][c] != 0)
						ctx.drawImage(
						img[tetromino.preview[r][c]],
						x + c*that.SIZE + 1,
						y + r*that.SIZE + 1,
						that.SIZE - 2,
						that.SIZE - 2
						);
			}
		}
	}
}

$(window).load(function() {
	var c = $("#gameCanvas")[0];
	window.ctx = c.getContext("2d");

	window.game = new Game(c, ctx);
	window.game.start();
});