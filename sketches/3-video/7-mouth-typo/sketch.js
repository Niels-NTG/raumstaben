// Mouth position-based typographical brush using P_2_3_3_01 (Generative Gestaltung) and face tracking technology (https://github.com/auduno/clmtrackr).

var capture;
var tracker;

var x = 0;
var y = 0;
var previousX = x;
var previousY = y;
var minStepSize = 4;
var maxStepSize = 512;

var font = 'Georgia';
var letters = "All the world's a stage, and all the men and women merely players. They have their exits and their entrances.";
var fontSizeMin = 3;
var angleDistortion = 0.0;

var counter = 0;

function setup() {
	// Create video capture
	capture = createCapture(VIDEO);
	capture.size(windowWidth, windowHeight);
	capture.position(0, 0);
	// capture.hide();

	var c = createCanvas(windowWidth, windowHeight);
	c.position(0, 0);

	colorMode(HSB, 360, 100, 100);

	// Start face tracking using webcam as input
	tracker = new clm.tracker();
	tracker.init();
	tracker.start(capture.elt);

	textFont(font);
	textAlign(LEFT);
	fill(255);
}

function draw() {
	// image(capture, 0, 0, width, height);
	var currentMouthPosition = tracker.getCurrentPosition()[57];
	if (!currentMouthPosition) return false;
	x = map(currentMouthPosition[0], 0, capture.width, 0, width);
	y = map(currentMouthPosition[1], 0, capture.height, 0, height);

	var d = dist(x, y, previousX, previousY);
	textSize(fontSizeMin + d / 2);
	var newLetter = letters.charAt(counter);
	minStepSize = textWidth(newLetter);

	if (d > minStepSize && d < maxStepSize) {
		var angle = atan2(previousY - y, previousX - x);

		push();
		translate(x, y);
		rotate(angle + random(angleDistortion));
		text(newLetter, 0, 0);
		pop();

		counter++;
		if (counter >= letters.length) counter = 0;

		x += cos(angle) * minStepSize;
		y += sin(angle) * minStepSize;
	}

	previousX = x;
	previousY = y;
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
