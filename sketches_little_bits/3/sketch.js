// Analog pressure sensor + analog light sensor + digital input visualisation

// TODO add documentation
// TODO tweakables

var serial;
var serialPort = '/dev/cu.usbmodem14521';

var pressureValue = 0;
var lightValue = 0;
var inverted = false;
var currentAnalogValues = [pressureValue, lightValue, inverted];

function setup() {
	createCanvas(windowWidth, windowHeight);

	fill(255);
	textFont('monospace');
	textAlign(CENTER, CENTER);
	textSize(200);
	strokeWeight(4);

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

function parseData() {
	var newAnalogValues = serial.readStringUntil('\r\n');
	currentAnalogValues = newAnalogValues.split(' ').map(Number);
	if (currentAnalogValues.length === 3) {
		pressureValue = currentAnalogValues[0];
		lightValue = currentAnalogValues[1];
		inverted = !!currentAnalogValues[2];
	}
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}