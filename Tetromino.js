// Load the images !
var img = [];
img[1] = $("#b1")[0];
img[2] = $("#b2")[0];
img[3] = $("#b3")[0];
img[4] = $("#b4")[0];
img[5] = $("#b5")[0];
img[6] = $("#b6")[0];
img[7] = $("#b7")[0];

// A simple data structure to represent the forms of the
// Tetrominoes.
function Tetromino() {
	this.matrices = [];
		// matrices[0] = 0 degrees rotation
		// matrices[1] = 90 degrees rotation
		// matrices[2] = 180 degrees rotation
		// matrices[3] = 270 degrees rotation
	this.ghostColor = "#000";
	this.preview = []; // hold & next display
}

// We'll keep our Tetromino definitions in a map
// Cyan I
// Yellow O
// Purple T
// Green S
// Red Z
// Blue J
// Orange L
// Ref: http://tetris.wikia.com/wiki/SRS

var tets = []; 
tets[0] = new Tetromino();
tets[1] = new Tetromino();
tets[2] = new Tetromino();
tets[3] = new Tetromino();
tets[4] = new Tetromino();
tets[5] = new Tetromino();
tets[6] = new Tetromino();

// I
tets[0].matrices[0] = [
	[0, 0, 0, 0],
	[1, 1, 1, 1],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];
tets[0].matrices[1] = [
	[0, 0, 1, 0],
	[0, 0, 1, 0],
	[0, 0, 1, 0],
	[0, 0, 1, 0]
];
tets[0].matrices[2] = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[1, 1, 1, 1],
	[0, 0, 0, 0]
];
tets[0].matrices[3] = [
	[0, 1, 0, 0],
	[0, 1, 0, 0],
	[0, 1, 0, 0],
	[0, 1, 0, 0]
];

tets[0].preview = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[1, 1, 1, 1],
	[0, 0, 0, 0]
];

tets[0].ghostColor = "rgba(0, 255, 255, 1.0)"; //cyan

// O
tets[1].matrices[0] = [
	[0, 2, 2, 0],
	[0, 2, 2, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];
tets[1].matrices[1] = [
	[0, 2, 2, 0],
	[0, 2, 2, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];
tets[1].matrices[2] = [
	[0, 2, 2, 0],
	[0, 2, 2, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];
tets[1].matrices[3] = [
	[0, 2, 2, 0],
	[0, 2, 2, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

tets[1].preview = [
	[0, 0, 0, 0],
	[0, 2, 2, 0],
	[0, 2, 2, 0],
	[0, 0, 0, 0]
];

tets[1].ghostColor = "rgba(255, 255, 0, 1.0)"; // yellow

// T
tets[2].matrices[0] = [
	[0, 3, 0, 0],
	[3, 3, 3, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];
tets[2].matrices[1] = [
	[0, 3, 0, 0],
	[0, 3, 3, 0],
	[0, 3, 0, 0],
	[0, 0, 0, 0]
];
tets[2].matrices[2] = [
	[0, 0, 0, 0],
	[3, 3, 3, 0],
	[0, 3, 0, 0],
	[0, 0, 0, 0]
];
tets[2].matrices[3] = [
	[0, 3, 0, 0],
	[3, 3, 0, 0],
	[0, 3, 0, 0],
	[0, 0, 0, 0]
];

tets[2].preview = [
	[0, 0, 0, 0],
	[0, 3, 0, 0],
	[3, 3, 3, 0],
	[0, 0, 0, 0]
];

tets[2].ghostColor = "rgba(255, 0, 255, 1.0)"; // purple

// S
tets[3].matrices[0] = [
	[0, 4, 4, 0],
	[4, 4, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];
tets[3].matrices[1] = [
	[0, 4, 0, 0],
	[0, 4, 4, 0],
	[0, 0, 4, 0],
	[0, 0, 0, 0]
];
tets[3].matrices[2] = [
	[0, 0, 0, 0],
	[0, 4, 4, 0],
	[4, 4, 0, 0],
	[0, 0, 0, 0]
];
tets[3].matrices[3] = [
	[4, 0, 0, 0],
	[4, 4, 0, 0],
	[0, 4, 0, 0],
	[0, 0, 0, 0]
];

tets[3].preview = [
	[0, 0, 0, 0],
	[0, 4, 4, 0],
	[4, 4, 0, 0],
	[0, 0, 0, 0]
];

tets[3].ghostColor = "rgba(0, 255, 0, 1.0)"; // green


// Z
tets[4].matrices[0] = [
	[5, 5, 0, 0],
	[0, 5, 5, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];
tets[4].matrices[1] = [
	[0, 0, 5, 0],
	[0, 5, 5, 0],
	[0, 5, 0, 0],
	[0, 0, 0, 0]
];
tets[4].matrices[2] = [
	[0, 0, 0, 0],
	[5, 5, 0, 0],
	[0, 5, 5, 0],
	[0, 0, 0, 0]
];
tets[4].matrices[3] = [
	[0, 5, 0, 0],
	[5, 5, 0, 0],
	[5, 0, 0, 0],
	[0, 0, 0, 0]
];

tets[4].preview = [
	[0, 0, 0, 0],
	[5, 5, 0, 0],
	[0, 5, 5, 0],
	[0, 0, 0, 0]
];

tets[4].ghostColor = "rgba(255, 0, 0, 1.0)"; // red

// J
tets[5].matrices[0] = [
	[6, 0, 0, 0],
	[6, 6, 6, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];
tets[5].matrices[1] = [
	[0, 6, 6, 0],
	[0, 6, 0, 0],
	[0, 6, 0, 0],
	[0, 0, 0, 0]
];
tets[5].matrices[2] = [
	[0, 0, 0, 0],
	[6, 6, 6, 0],
	[0, 0, 6, 0],
	[0, 0, 0, 0]
];
tets[5].matrices[3] = [
	[0, 6, 0, 0],
	[0, 6, 0, 0],
	[6, 6, 0, 0],
	[0, 0, 0, 0]
];

tets[5].preview = [
	[0, 0, 0, 0],
	[6, 0, 0, 0],
	[6, 6, 6, 0],
	[0, 0, 0, 0]
];

tets[5].ghostColor = "rgba(0, 127, 255, 1.0)"; // blue

// L
tets[6].matrices[0] = [
	[0, 0, 7, 0],
	[7, 7, 7, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];
tets[6].matrices[1] = [
	[0, 7, 0, 0],
	[0, 7, 0, 0],
	[0, 7, 7, 0],
	[0, 0, 0, 0]
];
tets[6].matrices[2] = [
	[0, 0, 0, 0],
	[7, 7, 7, 0],
	[7, 0, 0, 0],
	[0, 0, 0, 0]
];
tets[6].matrices[3] = [
	[7, 7, 0, 0],
	[0, 7, 0, 0],
	[0, 7, 0, 0],
	[0, 0, 0, 0]
];

tets[6].preview = [
	[0, 0, 0, 0],
	[0, 0, 7, 0],
	[7, 7, 7, 0],
	[0, 0, 0, 0]
];

tets[6].ghostColor = "rgba(255, 127, 0, 1.0)"; // orange