// Simple sketch that represents the current microphone level + waveform + spectrum analysis.

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
}

function draw() {
	background(13, 252, 0);

	// Create bar graph on the energy level of the bass,
	// lowMid, mid, highMid and treble part of the spectrum
	fft.analyze();
	noStroke();
	fill(0, 230, 154);
	var bassEnergy = fft.getEnergy('bass');
	rect(0, height, width / 5, map(bassEnergy, 0, 255, 0, -height));
	var lowMidEnergy = fft.getEnergy('lowMid');
	rect(0, height, width / 5 * 1, map(lowMidEnergy, 0, 255, 0, -height));
	var midEnergy = fft.getEnergy('mid');
	rect(0, height, width / 5 * 2, map(midEnergy, 0, 255, 0, -height));
	var highMidEnergy = fft.getEnergy('highMid');
	rect(0, height, width / 5 * 3, map(highMidEnergy, 0, 255, 0, -height));
	var trebleEnergy = fft.getEnergy('treble');
	rect(0, height, width / 5 * 3, map(trebleEnergy, 0, 255, 0, -height));

	// Decay recordHighLevel every frame by 0.002
	recordHighLevel -= 0.002;

	// If current mic level is higher than recordHighLevel,
	// set this value as the new recordHighLevel
	var micLevel = mic.getLevel();
	if (micLevel > recordHighLevel) {
		recordHighLevel = micLevel;
	}

	// Draw circle to represent highest recorded volume
	var recordLevelRadius = lerp(4, width, recordHighLevel);
	noFill();
	stroke(0);
	strokeWeight(8);
	ellipse(width / 2, height / 2, recordLevelRadius, recordLevelRadius);

	// Draw circle to represent current volume
	var currentLevelRadius = lerp(4, width, micLevel);
	noStroke();
	fill(116, 25, 122);
	ellipse(width / 2, height / 2, currentLevelRadius, currentLevelRadius);

	// Create waveform; an array of amplitudes between
	// -1 and 1. Use this to draw a waveform across
	// the width of the canvas
	var waveform = fft.waveform();
	noFill();
	stroke(255);
	strokeWeight(2);
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
