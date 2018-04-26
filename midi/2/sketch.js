// 1 channel MIDI pitch visualisation

// TODO documentation
// TODO tweakables UI

var currentPitch = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);

	colorMode(HSB, 360, 100, 100);
	textAlign(LEFT, TOP);
	textSize(100);
	strokeWeight(4);
	noFill();
}

function draw() {
	background(0, 0, 10, 0.1);

	var r = map(currentPitch, 0, 100, 0, width / 2);
	stroke(map(currentPitch, 0, 100, 0, 360), 100, 100);
	ellipse(width / 2, height / 2, r, r);
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}

p5.midi.onInput = function(e) {
	var address = e.data[0]
	var pitch = e.data[1];
	var gate = e.data[2];
	console.log(e.data);

	currentPitch = pitch;
}