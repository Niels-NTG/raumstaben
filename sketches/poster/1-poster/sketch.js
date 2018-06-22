// Webcam color sampler + distance measurement based on face tracking technology.

var capture;

var tracker;

var sampleColorCount = 8;
var sampleQuality = 400;

var rowCount = 8;
var columnCount = 8;

var screenWidth = 1920;
var screenHeight = 1080;

var minEyeDistance = 100;
var maxEyeDistance = 300;

var gui;

function setup() {
	// Create video capture
	capture = createCapture(VIDEO);
	capture.size(640, 480);
	capture.position(0, 0);
	capture.hide();

	// Start face tracking using webcam as input
	tracker = new clm.tracker();
	tracker.init();
	tracker.start(capture.elt);

	createCanvas(screenWidth, screenHeight);

	// Create GUI for tweaking values during runtime
	gui = QuickSettings.create(10, 10);
	gui.bindRange('sampleColorCount', 1, 256, sampleColorCount, 1, window);
	gui.bindRange('sampleQuality', 1, 640, sampleQuality, 1, window);
	gui.bindNumber('rowCount', 1, height, rowCount, 1, window);
	gui.bindNumber('columnCount', 1, width, columnCount, 1, window);
	gui.bindNumber('minEyeDistance', 1, capture.width, minEyeDistance, window);
	gui.bindNumber('maxEyeDistance', 2, capture.width, maxEyeDistance, window);

	// Update drawing every time the camera has a new frame ready
	capture.elt.ontimeupdate = onNewFrame;
}

function onNewFrame() {
	noStroke();

	// Calculate vertical and horizontal pixel size
	var captureRowPixelSize = capture.height / rowCount;
	var captureColumnPixelSize = capture.width / columnCount;
	var screenRowPixelSize = height / rowCount;
	var screenColumnPixelSize = width / columnCount;

	// Iterate through each subdivision
	for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		for (let columnIndex = 0; columnIndex < columnCount; columnIndex++)	{

			// Get a region of pixels from the capture image at the current subdivision
			let block = capture.get(captureColumnPixelSize * columnIndex, captureRowPixelSize * rowIndex, captureColumnPixelSize, captureRowPixelSize);
			block.loadPixels();

			// Real pixel count is equal to the pixels array, which is in actuality an array of subpixels,
			// (red, green, blue, alpha). By dividing it by 4 we get the actual number of pixels.
			let realBlockPixelCount = block.pixels.length / 4;

			// Sample quantized average color from subdivision region.
			let sampledPixels = [];
			for (let i = 0, offset, r, g, b; i < realBlockPixelCount; i += sampleQuality) {
				offset = i * 4;
				r = block.pixels[offset + 0];
				g = block.pixels[offset + 1];
				b = block.pixels[offset + 2];
				if (!(r > 200 && g > 200 && b > 200)) {
					sampledPixels.push([r, g, b]);
				}
			}
			let cmap = MMCQ.quantize(sampledPixels, sampleColorCount);
			let fillColor = cmap ? color(cmap.palette()[0]) : color(0);
			fill(fillColor);
			rect(screenColumnPixelSize * (columnCount - columnIndex - 1), screenRowPixelSize * rowIndex, screenColumnPixelSize, screenRowPixelSize);
		}
	}

	var pos = tracker.getCurrentPosition();
	if (pos) {
		// Calculate eye distance measured in screen space pixels.
		let leftEyeX = scaleCaptureXtoScreenX(pos[28][0]);
		let leftEyeY = scaleCaptureYtoScreenY(pos[28][1]);
		let rightEyeX = scaleCaptureXtoScreenX(pos[23][0]);
		let rightEyeY = scaleCaptureYtoScreenY(pos[23][1]);
		let eyeDistance = dist(leftEyeX, leftEyeY, rightEyeX, rightEyeY);

		// Visualise eye distance.
		stroke(255);
		strokeWeight(4);
		line(leftEyeX, leftEyeY, rightEyeX, rightEyeY);
		fill(0);
		textSize(40);
		text(eyeDistance, width / 2, height / 2);

		// Draw face tracking points as polygon.
		noStroke();
		blendMode(MULTIPLY);
		beginShape();
		for (let i = 0; i < pos.length; i++) {
			let facePointX = scaleCaptureXtoScreenX(pos[i][0]);
			let facePointY = scaleCaptureYtoScreenY(pos[i][1]);
			vertex(facePointX, facePointY);
		}
		fill(200, 0, 0);
		endShape();

		// Reset blendMode to default.
		blendMode(BLEND);
	}
}

// Scale value from 0 to 640 (native webcam width in pixels) to the screen width in pixels and mirror it at the same time.
function scaleCaptureXtoScreenX(x) {
	return map(x, 0, capture.width, width, 0);
}

// Scale value from 0 to 480 (native webcam height in pixels) to the screen height in pixels.
function scaleCaptureYtoScreenY(y) {
	return map(y, 0, capture.height, 0, height);
}
