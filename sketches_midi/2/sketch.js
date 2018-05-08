// Audio in + 4 channel MIDI visualiser
var mic;
var fft;

// Highest recorded mic level
var recordHighLevel = 0;

// MIDI channels info
var channels = [
	{
		text: 'BUMM',
		active: false,
		enableAddress: 144,
		disableAddress: 128,
		pitch: 0,
		gate: 0
	}, {
		text: 'TSCHACK',
		active: false,
		enableAddress: 145,
		disableAddress: 129,
		pitch: 0,
		gate: 0
	}, {
		text: 'TZINKIZIKIZIK',
		active: false,
		enableAddress: 146,
		disableAddress: 130,
		pitch: 0,
		gate: 0
	}, {
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

	// Start audio input
	mic = new p5.AudioIn();
	mic.start();

	// Start FFT (Fast Fourier Transform) audio analysis on
	// the mic input.
	// For more info, see: https://p5js.org/reference/#/p5.FFT
	fft = new p5.FFT();
	fft.setInput(mic);

	colorMode(HSB, 360, 100, 100);
	textFont('serif');
	textAlign(LEFT, TOP);
	textSize(100);
	strokeWeight(4);
}

function draw() {
	background(0, 0, 10, 0.75);

	// If current mic level is higher than recordHighLevel,
	// set this value as the new recordHighLevel
	var micLevel = mic.getLevel();
	if (micLevel > recordHighLevel) {
		recordHighLevel = micLevel;
	}

	// Draw circle to represent highest recorded volume
	var recordLevelRadius = lerp(4, width, recordHighLevel);
	noFill();
	stroke(0, 100, 100);
	ellipse(width / 2, height, recordLevelRadius, recordLevelRadius);

	// Draw circle to represent current volume
	var currentLevelRadius = lerp(4, width, micLevel);
	noStroke();
	fill(200);
	ellipse(width / 2, height, currentLevelRadius, currentLevelRadius);

	// Check all channels for their current state
	// If channel is active, display its text
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

// Listen for incoming MIDI messages
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
