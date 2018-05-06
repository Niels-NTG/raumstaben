// TODO better smoothing
// TODO fix text alignment
// TODO add text overflow bleeding edges

// https://kylemcdonald.github.io/cv-examples/FrameDifference/

var font = null;
var fontSize = 60;
var textAlignment = 'center';
var textToRender = "Pa's wijze lynx bezag vroom het fikse aquaduct";
var fontFileName = 'data/KairosSans_Variable.ttf';
var wordBreak = false;
var textColor = '#ffd600';
var fontAxes = [];

var textElement;

var gui;

var capture;
var previousPixels;
var threshold = 200;
var showMovementCapture = true;
var movementValue = 0;
var maxMovementValue = 1;

function preload() {
	loadFontFile();
}

function setup() {
	capture = createCapture(VIDEO);
	capture.size(640, 480);
	capture.position(0, 0);
	capture.hide();

	var c = createCanvas(windowWidth, windowHeight);
	c.position(0, 0);

	textElement = createDiv(textToRender);
	textElement.attribute('contenteditable', true);
	textElement.position(0, 0);
	textElement = textElement.elt;
	textElement.style.outline = 'none';
	textElement.style.height = '100%';
	textElement.style.display = 'flex';
	textElement.style.alignItems = 'center';

	gui = QuickSettings.create(10, 10);
	gui.bindRange('threshold', 0, 400, threshold, 1, window);
	gui.bindBoolean('showMovementCapture', showMovementCapture, window);
	gui.addHTML('font info', '');
	gui.addFileChooser('font file name', fontFileName, '*', loadFontFile);
	gui.bindRange('fontSize', 0, 200, fontSize, 0.01, window);
	gui.bindDropDown('textAlignment', ['left', 'right', 'center', 'justify', 'start', 'end'], window);
	gui.bindBoolean('wordBreak', wordBreak, window);
	gui.bindColor('textColor', textColor, window);
	gui.setGlobalChangeHandler(renderText);
}

function draw() {
	capture.loadPixels();
	movementValue = 0;
	if (capture.pixels.length > 0) {

		if (!previousPixels) {
			// Clone pixel array.
			previousPixels = capture.pixels.slice(0);
		} else {

			var i = 0;
			var pixels = capture.pixels;

			for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
					// calculate the differences
					var rdiff = Math.abs(pixels[i + 0] - previousPixels[i + 0]);
					var gdiff = Math.abs(pixels[i + 1] - previousPixels[i + 1]);
					var bdiff = Math.abs(pixels[i + 2] - previousPixels[i + 2]);
					// copy the current pixels to previousPixels
					previousPixels[i + 0] = pixels[i + 0];
					previousPixels[i + 1] = pixels[i + 1];
					previousPixels[i + 2] = pixels[i + 2];
					var diffs = rdiff + gdiff + bdiff;
					var output = 0;
					if (diffs > threshold) {
						output = 255;
						movementValue += diffs;
					}
					pixels[i++] = output;
					pixels[i++] = output;
					pixels[i++] = output;
					// also try this:
					// pixels[i++] = rdiff;
					// pixels[i++] = gdiff;
					// pixels[i++] = bdiff;
					i++; // skip alpha
				}
			}
		}
	}

	if (movementValue > 0) {
		if (showMovementCapture) {
			capture.updatePixels();
			image(capture, 0, 0, width, height);
		}

		maxMovementValue = max(maxMovementValue, movementValue);
		setFontAxisValue();
	}
}

function setFontAxisValue() {
	fontAxes.forEach(function(axis) {
		if (axis[axis.tag + '_enabled']) {
			axis[axis.tag] = map(movementValue, 0, maxMovementValue, axis.minValue, axis.maxValue);
		} else {
			axis[axis.tag] = axis.defaultValue;
		}
	});
	renderText();
	updateGUI();
}

function renderText() {
	textElement.style.fontSize = fontSize + 'pt';
	textElement.style.textAlign = textAlignment;
	textElement.style.wordBreak = wordBreak ? 'break-all' : '';
	textElement.style.color = textColor;
	textElement.style.fontVariationSettings = fontAxes.map(function (axis) {
		return '"' + axis.tag + '" ' + axis[axis.tag];
	}).join(', ');
}

function updateGUI() {
	// Show font info
	var axesInfo = fontAxes.map(function(axis) {
		return axis.tag + ' (' + axis.name.en + ')\t ' + axis[axis.tag];
	}).join('\n');
	gui.setValue('font info',
		'<pre>' +
		font.names.fontFamily.en + '\n\n' +
		'<b>' + font.tables.fvar.axes.length + ' axes:</b>\n' +
		axesInfo +
		'</pre>'
	);
}

function loadFontFile(file) {
	if (file) {
		fontFileName = URL.createObjectURL(file);
	}
	opentype.load(fontFileName, function(err, font) {
		if (err) {
			console.warn(err);
			return;
		}
		onFontLoaded(font);
	});
}

function onFontLoaded(font) {
	window.font = font;

	fontAxes.forEach(function (axis) {
		gui.removeControl(axis.tag + '_enabled');
	});

	// Add current value at value of default axis value.
	fontAxes = font.tables.fvar.axes;
	fontAxes = fontAxes.map(function(axis) {
		axis[axis.tag] = axis.defaultValue;
		axis[axis.tag + '_enabled'] = true;
		return axis;
	});

	document.getElementById('font-styles').innerText =
		'@font-face {font-family:"' + font.names.fontFamily.en + '"; ' +
		'src: url("' + fontFileName + '") format("truetype");}';
	textElement.style.fontFamily = font.names.fontFamily.en;

	fontAxes.forEach(function (axis) {
		gui.bindBoolean(axis.tag + '_enabled', axis[axis.tag + '_enabled'], axis);
	});

	updateGUI();
	renderText();
}
