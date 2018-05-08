var capture;
var tracker;

var nosePos;
var previousNosePos;

function setup() {
	capture = createCapture(VIDEO);
	capture.size(640, 480);
	capture.position(0, 0);

	var c = createCanvas(capture.width, capture.height);
	c.position(0, 0);

	colorMode(HSB, 360, 100, 100);

	// https://github.com/auduno/clmtrackr
	tracker = new clm.tracker();
	// TODO custom face model. What about pModel?
	tracker.init();
	tracker.start(capture.elt);

}

function draw() {
	nosePos = tracker.getCurrentPosition()[62];

	if (nosePos && previousNosePos) {
		var r = map(dist(
			nosePos[0], nosePos[1],
			previousNosePos[0], previousNosePos[1]
		), 0, 200, 4, 64);
		ellipse(nosePos[0], nosePos[1], r, r);
	}

	previousNosePos = nosePos;

}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
