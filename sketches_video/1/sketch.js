var capture;
var tracker;

function setup() {
	capture = createCapture(VIDEO);
	capture.size(640, 480);
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
	image(capture, 0, 0, width, height)

	let pos = tracker.getCurrentPosition();
	for (let i = 0; i < pos.length; i++) {
		let element = pos[i];
		stroke(255);
		fill(100, 100, 100);
		ellipse(element[0], element[1], 32, 32);
		noStroke();
		fill(0);
		text(i, element[0], element[1]);
	}
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), '.png');
}
