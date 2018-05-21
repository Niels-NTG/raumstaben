// Simple sketch that represents the current microphone level as a circle radius. For an introduction in working with microphone input, see this Daniel Shiffman video https://youtu.be/q2IDNkUws-A.

var mic;

// Highest recorded mic level
var recordHighLevel = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);

	// Start audio input
	mic = new p5.AudioIn();
	mic.start();

	strokeWeight(8);
}

function draw() {
	background(13, 252, 0);

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
	ellipse(width / 2, height / 2, recordLevelRadius, recordLevelRadius);

	// Draw circle to represent current volume
	var currentLevelRadius = lerp(4, width, micLevel);
	noStroke();
	fill(116, 25, 122);
	ellipse(width / 2, height / 2, currentLevelRadius, currentLevelRadius);
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
