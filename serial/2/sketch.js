// Analog light sensor visualisation

// TODO add documentation
// TODO tweakables

var serial;
var serialPort = '/dev/cu.usbmodem14521';

var lightValue = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);

	fill(255);
	textFont('monospace');
	textAlign(CENTER, CENTER);
	textSize(200);
	stroke(255);
	strokeWeight(4);

	serial = new p5.SerialPort();
	serial.open(serialPort);
	serial.on('data', parseData);
}

function draw() {
	background(lightValue);
	fill(255 - lightValue);
	text(lightValue, width / 2, height / 2);
}

function parseData() {
	var newLightValue = parseInt(serial.readStringUntil('\r\n'));
	if (isFinite(newLightValue)) {
		lightValue = newLightValue;
	}
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}