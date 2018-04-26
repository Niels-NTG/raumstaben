// Audio in + 4 channel MIDI visualiser

// TODO documentation
// TODO fft visualisation
// TODO tweakables UI

var mic;

var fft;

var recordHighLevel = 0;

var channels = [
	{
		text: 'BUMM',
		active: false,
		enableAddress: 144,
		disableAddress: 128,
		pitch: 0,
		gate: 0,
	},
	{
		text: 'TSCHACK',
		active: false,
		enableAddress: 145,
		disableAddress: 129,
		pitch: 0,
		gate: 0
	},
	{
		text: 'TZINKIZIKIZIK',
		active: false,
		enableAddress: 146,
		disableAddress: 130,
		pitch: 0,
		gate: 0
	},
	{
		text: 'LAAAALALALAAA',
		active: false,
		enableAddress: 147,
		disableAddress: 131,
		pitch: 0,
		gate: 0
	}
];

function setup() {
	createCanvas(windowWidth, windowHeight);
	mic = new p5.AudioIn();
	mic.start();

	fft = new p5.FFT();
	fft.setInput(mic);

	colorMode(HSB, 360, 100, 100);
	textFont('serif');
	textAlign(LEFT, TOP);
	textSize(100);
	strokeWeight(4);
}

function draw() {
	background(0, 0, 10, 1);

	var micLevel = mic.getLevel();
	if (micLevel > recordHighLevel) {
		recordHighLevel = micLevel;
	}

	var recordLevelRadius = lerp(4, width / 2, recordHighLevel);
	noFill();
	stroke(0, 100, 100);
	ellipse(width / 2, height, recordLevelRadius, recordLevelRadius);

	var currentLevelRadius = lerp(4, width / 2, micLevel);
	noStroke();
	fill(200);
	ellipse(width / 2, height, currentLevelRadius, currentLevelRadius);

	noStroke();
	for (let i = 0; i < channels.length; i++) {
		const channel = channels[i];
		if (channel.active) {
			text(channel.text, 32, 32 + (100 * i));
		}
	}
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}

p5.midi.onInput = function(e) {
	var address = e.data[0]
	var pitch = e.data[1];
	var gate = e.data[2];

	console.log(e.data);

	for (let i = 0; i < channels.length; i++) {
		let channel = channels[i];
		if (address === channel.enableAddress) {
			channel.active = true;
		} else if (address === channel.disableAddress) {
			channel.active = false;
		}

		if (address === channel.enableAddress || address === channel.disableAddress) {
			channel.pitch = pitch;
			channel.gate = gate;
		}
	}
}