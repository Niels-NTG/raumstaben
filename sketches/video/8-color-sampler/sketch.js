// webcam color sampler.

var capture;
var showCapture = true;
var sampleColorCount = 100;
var sampleQuality = 100;
var captureImage;

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
	gui.bindBoolean('showCapture', showCapture, window);
	gui.bindRange('sampleColorCount', 1, 100, sampleColorCount, 1, window);
	gui.bindRange('sampleQuality', 1, 1000, sampleQuality, 1, window);
	gui.bindNumber('rowCount', 1, windowHeight, rowCount, 1, window);
	gui.bindNumber('columnCount', 1, windowWidth, columnCount, 1, window);

}

function draw() {
	// Start drawing if webcam is ready
	if (!capture.loadedmetadata) return;

	var rowPixelSize = capture.height / rowCount;
	var columnPixelSize = capture.width / columnCount;

	for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		for (var columnIndex = 0; columnIndex < columnCount; columnIndex++)	{

			var block = capture.get(columnPixelSize * columnIndex, rowPixelSize * rowIndex, columnPixelSize, rowPixelSize);
			block.loadPixels();
			var sampledPixels = [];
			for (var i = 0, offset, r, g, b, a; i < block.pixels.length; i += sampleQuality) {
				offset = i * 4;
				r = block.pixels[offset + 0];
				g = block.pixels[offset + 1];
				b = block.pixels[offset + 2];
				a = block.pixels[offset + 3];
				if (a >= 125) {
					if (!(r > 200 && g > 200 && b > 200)) {
						sampledPixels.push([r, g, b]);
					}
				}
			}
			var cmap = MMCQ.quantize(sampledPixels, sampleColorCount);
			var fillColor = (cmap ? color(cmap.palette()[0]) : color(0)).toString();
			fill(fillColor);
			rect(columnPixelSize * columnIndex, rowPixelSize * rowIndex, columnPixelSize, rowPixelSize);
		}
	}
}
