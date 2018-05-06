var mic;

var recordHighLevel = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	mic = new p5.AudioIn();
	mic.start();

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

}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
