// Classes in JavaScript are functions. It's just one of the many quirks of the
// language that make it oh-so special. Funny, ain't it?
function Tetris (ctx) {
	// We need to save the instance pointer, because when we write new methods,
	// 'this' gets replaced by the a reference to the new method.
	var that = this;
	
	// Here are our constants. The JavaScript language has no way to make
	// constants, so we'll have to do it by convention. Constants will
	// written in all caps, like in many C programs.
	this.ROWS = 22;
	this.COLUMNS = 10;
	this.MARGIN_LEFT = 171;
	this.MARGIN_TOP = 169;
	this.SIZE = 20;
	
	
	// Here are our instance variables. Notice how since they're not constants,
	// we use standard Camel-Case.
	
	// This is actually going to be a multi-dimensional array that will contain
	// the locations of the blocks merged with the Playfield.
	this.matrix = [];
	
	
	
	// Okay, I know we're inside a function and we can technically intialize
	// stuff outside of methods but let's keep our code clean and practice
	// good structured programming techniques. :)
	(function initialize() {
	
		for (var r = 0; r < that.ROWS; r++) {
			var myRow = [];
			for (var c = 0; c < that.COLUMNS; c++)
				myRow.push(0); // need to make an array with the right amount of columns
			that.matrix.push(myRow);
		}
		
	})(); // call this function, initialize
	
	
	
	// JavaScript is awesome ... we can set our methods by assigning anchor
	// anonymous function to an member field.
	
	// Tetris guidelines say that rows higher than 20 should not appear
	// on the Playfield.
	// Ref: http://tetris.wikia.com/wiki/Tetris_Guideline
	this.getVisibleRows = function() {
		var visibleRows = that.ROWS;
		if (that.ROWS > 20) visibleRows = 20;
		return visibleRows;
	}
	
	// This function draws the Playfield
	this.draw = function() {
		
		var gradient = ctx.createLinearGradient(that.MARGIN_LEFT, that.MARGIN_TOP, that.MARGIN_LEFT, that.MARGIN_TOP + that.getVisibleRows()*that.SIZE);
		gradient.addColorStop(0, "#656565");
		gradient.addColorStop(1, "#222222");
		ctx.fillStyle = gradient;
		ctx.fillRect(that.MARGIN_LEFT, that.MARGIN_TOP, that.COLUMNS*that.SIZE, that.getVisibleRows()*that.SIZE);
		
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
		for (var r = 0; r < that.getVisibleRows(); r++) // For each row
			for (var c = 0; c < that.COLUMNS; c++) { // For each column
				// Stroke (outline) a rectangle of size 20x20
				ctx.strokeRect(that.MARGIN_LEFT + c*that.SIZE,
					that.MARGIN_TOP + r*that.SIZE,
					that.SIZE,
					that.SIZE);
					
				if ((r+c) % 2 == 0) { // checkered pattern
					ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
					ctx.fillRect(that.MARGIN_LEFT + c*that.SIZE,
						that.MARGIN_TOP + r*that.SIZE,
						that.SIZE,
						that.SIZE);
				}
			}
	
		that.fillPlayfield();
	}
	
	// Helper function to fill the Playfield
	this.fillPlayfield = function() {
		for (var r = 0; r < that.ROWS; r++)
			for (var c = 0; c < that.COLUMNS; c++)
				if (that.matrix[r][c] != 0)
					that.fillAt(r, c, that.matrix[r][c]);
	}
	
	// To help visualize the rows and columns
	// Excuse this code, it is not necessary.
	this.drawAnnotations = function() {
		ctx.fillStyle = "#000"; // black text
		for (var r = 0; r < that.ROWS; r++)
			ctx.fillText(r, that.MARGIN_LEFT/3, (r - that.ROWS + that.getVisibleRows())*that.SIZE + that.MARGIN_TOP + that.SIZE/1.5);
		for (var c = 0; c < that.COLUMNS; c++)
			ctx.fillText(c, c*that.SIZE + that.MARGIN_LEFT + that.SIZE/3, that.MARGIN_TOP/1.5);
	}
	
	// Helper function, to draw a type of Tetromino at (row, column) on the visible Playfield
	// Maps to x, y
	this.fillAt = function(row, column, type) {
		if (row < that.ROWS - that.getVisibleRows()) return;
		
		ctx.drawImage(
			img[type],
			that.MARGIN_LEFT + column*that.SIZE + 1,
			that.MARGIN_TOP + (row - that.ROWS + 20)*that.SIZE + 1,
			that.SIZE - 2,
			that.SIZE - 2
			);
		/*ctx.fillRect(that.MARGIN_LEFT + column*that.SIZE + 1,
			that.MARGIN_TOP + (row - that.ROWS + 20)*that.SIZE + 1,
			that.SIZE - 2,
			that.SIZE - 2);*/
	}
	
	// Helper function, to draw a color in a Ghost-like rectangle
	this.fillGhost = function(row, column, color) {
		if (row < that.ROWS - that.getVisibleRows()) return;
		
		ctx.strokeStyle = color;
		ctx.strokeRect(that.MARGIN_LEFT + column*that.SIZE + 2,
			that.MARGIN_TOP + (row - that.ROWS + 20)*that.SIZE + 2,
			that.SIZE - 4,
			that.SIZE - 4);
	}
	
	
	// The functions below take a (row, column) and a tetromino.
	// row+r represents the Tetromino block's row, after being shifted
	// column+c represents the Tetromino block's column, after being shifted
	
	// Draws the Tetromino
	this.drawTetromino = function(row, column, tetromino, rotation) {
		var tMatrix = tetromino.matrices[rotation];

		// Calculate the local Tetromino then add to (row, column)
		// to get the offset
		for (var r = 0; r < 4; r++)
			for (var c = 0; c < 4; c++)
				if (tMatrix[r][c] != 0)
					that.fillAt(row+r, column+c, tMatrix[r][c])
	}
	
	// Draws the Ghost
	this.drawGhost = function(row, column, tetromino, rotation) {
		var tMatrix = tetromino.matrices[rotation];

		// Calculate the local Tetromino then add to (row, column)
		// to get the offset
		for (var r = 0; r < 4; r++)
			for (var c = 0; c < 4; c++)
				if (tMatrix[r][c] != 0)
					that.fillGhost(row+r, column+c, tetromino.ghostColor)
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
	
	// This is the function that checks if a Tetromino intersects the Playfield
	// matrix. Takes in a row and column to position the Tetromino matrix, and
	// the Tetromino matrix to check.
	// Returns the result of the intersect test (boolean).
	this.tIntersect = function(row, column, tetromino, rotation) {
		var tMatrix = tetromino.matrices[rotation];
		
		for (var r = 0; r < 4; r++)
			for (var c = 0; c < 4; c++)
				if (tMatrix[r][c] != 0 && that.matrix[row+r][column+c])
					return true;
		return false;
	}
	
	// Checks if Tetromino configuration at (row, column) is inside the bounds
	// of the application
	this.tInBounds = function(row, column, tetromino, rotation) {
		var tMatrix = tetromino.matrices[rotation];
		
		for (var r = 0; r < 4; r++)
			for (var c = 0; c < 4; c++)
				if (tMatrix[r][c] != 0) {
					if (row+r < 0 || row+r >= that.ROWS) return false;
					if (column+c < 0 || column+c >= that.COLUMNS) return false;
				}
				
		return true;
	}
	
	// Merges the Tetromino configuration at (row, column) with the matrix
	this.tMerge = function(row, column, tetromino, rotation) {
		var tMatrix = tetromino.matrices[rotation];
		
		for (var r = 0; r < 4; r++)
			for (var c = 0; c < 4; c++)
				if (tMatrix[r][c] != 0)
					that.matrix[row+r][column+c] = tMatrix[r][c];
	}
	
	// If line is full, remove it
	this.clearLines = function() {
		var linesCleared = 0;
		for (var r = 0; r < that.ROWS; r++) {
			var full = true;
			for (var c = 0; c < that.COLUMNS; c++)
				if (that.matrix[r][c] == 0) full = false;
			if (full) {
				// make an empty row
				var blank_row = [];
				for (var col = 0; col < that.COLUMNS; col++)
					blank_row.push(0);
					
				that.matrix.splice(r, 1); // remove
				that.matrix.unshift(blank_row); // add the empty to the beginning
				
				linesCleared++;
			}
		}
		
		return linesCleared;
	}
	
	// check if row is empty
	this.rowEmpty = function(r) {
		for (var c = 0; c < that.COLUMNS; c++)
			if (that.matrix[r][c] != 0) return false;
		return true;
	}
	
}