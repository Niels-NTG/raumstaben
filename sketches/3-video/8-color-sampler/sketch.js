// Webcam color sampler.

var capture;
var sampleColorCount = 32;
var sampleQuality = 100;

var rowCount = 8;
var columnCount = 8;

var gui;

function setup() {
	// Create video capture
	capture = createCapture(VIDEO);
	capture.size(640, 480);
	capture.position(0, 0);
	capture.hide();

	createCanvas(windowWidth, windowHeight);

	noStroke();

	// Create GUI for tweaking values during runtime
	gui = QuickSettings.create(10, 10);
	gui.bindRange('sampleColorCount', 1, 100, sampleColorCount, 1, window);
	gui.bindRange('sampleQuality', 1, 1000, sampleQuality, 1, window);
	gui.bindNumber('rowCount', 1, windowHeight, rowCount, 1, window);
	gui.bindNumber('columnCount', 1, windowWidth, columnCount, 1, window);
}

function draw() {
	// Start drawing if webcam is ready
	if (!capture.loadedmetadata) return;

	// Calculate vertical and horizontal pixel size
	var rowPixelSize = capture.height / rowCount;
	var columnPixelSize = capture.width / columnCount;

	// Iterate through each subdivision
	for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		for (let columnIndex = 0; columnIndex < columnCount; columnIndex++)	{

			// Get a region of pixels from the capture image at the current subdivision
			let block = capture.get(columnPixelSize * columnIndex, rowPixelSize * rowIndex, columnPixelSize, rowPixelSize);
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
			let fillColor = (cmap ? color(cmap.palette()[0]) : color(0)).toString();
			fill(fillColor);
			rect(columnPixelSize * columnIndex, rowPixelSize * rowIndex, columnPixelSize, rowPixelSize);
		}
	}
}
