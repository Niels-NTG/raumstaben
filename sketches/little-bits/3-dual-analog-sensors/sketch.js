// Analog pressure sensor + analog light sensor + digital input visualisation

var serial;
var serialPort = '/dev/cu.usbmodem14521';

var pressureValue = 0;
var lightValue = 0;
var inverted = false;
var currentValues = [pressureValue, lightValue, inverted];

function setup() {
	createCanvas(windowWidth, windowHeight);

	fill(255);
	textFont('monospace');
	textAlign(CENTER, CENTER);
	textSize(200);
	strokeWeight(4);

	// Open serial communication
	serial = new p5.SerialPort();
	serial.open(serialPort);
	serial.on('data', parseData);
}

function draw() {
	var backgroundColor = inverted ? 255 - lightValue : lightValue;
	var foregroundColor = inverted ? lightValue : 255 - lightValue;

	background(backgroundColor);
	fill(foregroundColor);
	var r = map(pressureValue, 0, 255, 0, width / 2);
	ellipse(width / 2, height / 2, r, r);
	fill(backgroundColor);
	stroke(foregroundColor);
	text(lightValue, width / 2, height / 2);
}

// When new serial data comes in, split incoming data by space and check if numbers are valid
function parseData() {
	var newValues = serial.readStringUntil('\r\n');
	currentValues = newValues.split(' ').map(Number);
	if (currentValues.length === 3) {
		pressureValue = currentValues[0];
		lightValue = currentValues[1];
		inverted = !!currentValues[2];
	}
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
