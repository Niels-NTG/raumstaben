// Face distance measurement based on face tracking technology. See https://github.com/auduno/clmtrackr for reference.

var capture;
var tracker;

function setup() {
	// Create video capture
	capture = createCapture(VIDEO);
	capture.size(windowWidth, windowHeight);
	capture.hide();

	createCanvas(windowWidth, windowHeight);

	textFont('monospace');
	textAlign(CENTER, CENTER);
	textSize(100);
	strokeWeight(2);

	// Start face tracking using webcam as input
	tracker = new clm.tracker();
	tracker.init();
	tracker.start(capture.elt);
}

function draw() {
	clear();
	var pos = tracker.getCurrentPosition();
	if (pos) {
		let leftEye = pos[28]
		let rightEye = pos[23];
		let d = dist(leftEye[0], leftEye[1], rightEye[0], rightEye[1]);
		noFill();
		ellipse(width / 2, height / 2, d, d);
		fill(0);
		text(round(d), width / 2, height / 2);
		ellipse(leftEye[0], leftEye[1], 16, 16);
		ellipse(rightEye[0], rightEye[1], 16, 16);
	}
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
