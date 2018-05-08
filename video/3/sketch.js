var capture;
var tracker;

function setup() {
	capture = createCapture(VIDEO);
	capture.size(640, 480);
	capture.position(0, 0);
	capture.hide();

	var c = createCanvas(capture.width, capture.height);
	c.position(0, 0);

	colorMode(HSB, 360, 100, 100);
	textAlign(CENTER, CENTER);
	strokeWeight(2);

	// https://github.com/auduno/clmtrackr
	tracker = new clm.tracker();
	tracker.init();
	tracker.start(capture.elt);

}

function draw() {
	clear();
	// image(capture, 0, 0, width, height)

	let pos = tracker.getCurrentPosition();
	if (pos) {
		var leftEye = pos[28]
		var rightEye = pos[23];
		var d = dist(leftEye[0], leftEye[1], rightEye[0], rightEye[1]);
		ellipse(width / 2, height / 2, d, d);
	}
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
