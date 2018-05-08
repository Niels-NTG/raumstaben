var mic;
var fft;

// Highest recorded mic level
var recordHighLevel = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);

	// Start audio input
	mic = new p5.AudioIn();
	mic.start();

	// Start FFT (Fast Fourier Transform) audio analysis on
	// the mic input.
	// For more info, see: https://p5js.org/reference/#/p5.FFT
	fft = new p5.FFT();
	fft.setInput(mic);

	strokeWeight(4);
}

function draw() {
	background(32);

	// If current mic level is higher than recordHighLevel,
	// set this value as the new recordHighLevel
	var micLevel = mic.getLevel();
	if (micLevel > recordHighLevel) {
		recordHighLevel = micLevel;
	}

	// Draw circle to represent highest recorded volume
	var recordLevelRadius = lerp(4, width, recordHighLevel);
	noFill();
	stroke(255, 0, 0);
	ellipse(width / 2, height / 2, recordLevelRadius, recordLevelRadius);

	// Draw circle to represent current volume
	var currentLevelRadius = lerp(4, width, micLevel);
	noStroke();
	fill(200);
	ellipse(width / 2, height / 2, currentLevelRadius, currentLevelRadius);

	// Create waveform; an array of amplitudes between
	// -1 and 1. Use this to draw a waveform across
	// the width of the canvas
	var waveform = fft.waveform();
	noFill();
	stroke(0, 200, 100);
	beginShape();
	for (let i = 0; i < waveform.length; i++) {
		vertex(
			map(i, 0, waveform.length, 0, width),
			lerp(0, height / 2, waveform[i]) + (height / 2)
		);
	}
	endShape();
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
