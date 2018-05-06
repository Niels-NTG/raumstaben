var mic;
var fft;

var recordHighLevel = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	mic = new p5.AudioIn();
	mic.start();

	fft = new p5.FFT();
	fft.setInput(mic);

	strokeWeight(4);
}

function draw() {
	background(32);

	var micLevel = mic.getLevel();
	if (micLevel > recordHighLevel) {
		recordHighLevel = micLevel;
	}

	var recordLevelRadius = lerp(4, width, recordHighLevel);
	noFill();
	stroke(255, 0, 0);
	ellipse(width / 2, height / 2, recordLevelRadius, recordLevelRadius);

	var currentLevelRadius = lerp(4, width, micLevel);
	noStroke();
	fill(200);
	ellipse(width / 2, height / 2, currentLevelRadius, currentLevelRadius);

	var waveform = fft.waveform();
	noFill();
	stroke(0, 200, 100);
	beginShape();
	for (var i = 0; i < waveform.length; i++) {
		vertex(
			map(i, 0, waveform.length, 0, width),
			lerp(0, height / 2, waveform[i]) + (height / 2)
		);
	}
	endShape();

	noStroke();
	fill(64);
	fft.analyze();
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

}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
