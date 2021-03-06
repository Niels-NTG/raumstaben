// Analog pressure sensor visualisation

var serial;
var serialPort = '/dev/cu.usbmodem14521';

var pressureValue = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);

	strokeWeight(4);

	// Open serial communication
	serial = new p5.SerialPort();
	serial.open(serialPort);
	serial.on('data', parseData);
}

function draw() {
	background(32);
	var r = map(pressureValue, 0, 255, 0, width / 2);
	ellipse(width / 2, height / 2, r, r);
}

// When new serial data comes in, update pressureValue if serial data is valid
function parseData() {
	var newPressureValue = parseInt(serial.readStringUntil('\r\n'));
	if (isFinite(newPressureValue)) {
		pressureValue = newPressureValue;
	}
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
