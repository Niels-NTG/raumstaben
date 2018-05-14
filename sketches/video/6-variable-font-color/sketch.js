// Variable font tester + webcam color sampler.

var capture;
var showCapture = true;
var sampleColorCount = 100;
var sampleQuality = 1;

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

function setup() {
	// Create video capture
	capture = createCapture(VIDEO);
	capture.size(640, 480);
	capture.position(0, 0);
	capture.hide();

	createCanvas(windowWidth, windowHeight);

	// Create text input element
	textElement = createDiv(textToRender);
	textElement.attribute('contenteditable', true);
	textElement.position(0, 0);
	textElement = textElement.elt;
	textElement.style.outline = 'none';
	textElement.style.height = '100%';
	textElement.style.display = 'flex';
	textElement.style.alignItems = 'center';

	// Create GUI for tweaking values during runtime
	gui = QuickSettings.create(10, 10);
	gui.bindBoolean('showCapture', showCapture, window);
	gui.bindRange('sampleColorCount', 1, 100, sampleColorCount, 1, window);
	gui.bindRange('sampleQuality', 1, 100, sampleQuality, 1, window);
	gui.addHTML('font info', '');
	gui.addFileChooser('font file name', fontFileName, '*', loadFontFile);
	gui.bindRange('fontSize', 0, 200, fontSize, 0.01, window);
	gui.bindDropDown('textAlignment', ['left', 'right', 'center', 'justify', 'start', 'end'], window);
	gui.bindBoolean('wordBreak', wordBreak, window);
	gui.setGlobalChangeHandler(renderText);

	loadFontFile();
}

function draw() {
	if (showCapture) {
		image(capture, 0, 0, width, height);
	} else {
		clear();
	}

	// Load raw pixel data from video input
	capture.loadPixels();
	var sampledPixels = [];
	for (var i = 0, offset, r, g, b, a; i < capture.pixels.length; i += sampleQuality) {
		offset = i * 4;
		r = capture.pixels[offset + 0];
		g = capture.pixels[offset + 1];
		b = capture.pixels[offset + 2];
		a = capture.pixels[offset + 3];
		if (a >= 125) {
			if (!(r > 250 && g > 250 && 250)) {
				sampledPixels.push([r, g, b]);
			}
		}
	}
	var cmap = MMCQ.quantize(sampledPixels, sampleColorCount);
	textColor = (cmap ? color(cmap.palette()[0]) : color(0)).toString();

	renderText();
}

function renderText() {
	// Apply font size
	textElement.style.fontSize = fontSize + 'pt';

	// Apply text alignment
	textElement.style.textAlign = textAlignment;

	// Apply breaking text at the character or word level
	textElement.style.wordBreak = wordBreak ? 'break-all' : '';

	// Apply text color
	textElement.style.color = textColor;

	// Apply variable font settings
	textElement.style.fontVariationSettings = fontAxes.map(function (axis) {
		return '"' + axis.tag + '" ' + axis[axis.tag];
	}).join(', ');
}

function updateGUI() {
	// Show font info: name, font axis count and axis tags
	var axesNames = fontAxes.map(function (axis) {
		return axis.tag + ' (' + axis.name.en + ')';
	}).join('\n');
	gui.setValue('font info',
		'<pre>' +
		font.names.fontFamily.en + '\n\n' +
		'<b>' + font.tables.fvar.axes.length + ' axes:</b>\n' +
		axesNames +
		'</pre>'
	);

	// Create sliders for each variable font axis
	fontAxes.forEach(function (axis) {
		gui.bindRange(axis.tag, axis.minValue, axis.maxValue, axis.defaultValue, 0.01, axis);
	});
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

	// Remove old font axis controls
	fontAxes.forEach(function (axis) {
		gui.removeControl(axis.tag);
	});

	// Add current value at value of default axis value.
	fontAxes = font.tables.fvar.axes;
	fontAxes = fontAxes.map(function (axis) {
		axis[axis.tag] = axis.defaultValue;
		return axis;
	});

	// Use fornt for text input area
	document.getElementById('font-styles').innerText =
		'@font-face {font-family:"' + font.names.fontFamily.en + '"; ' +
		'src: url("' + fontFileName + '") format("truetype");}';
	textElement.style.fontFamily = font.names.fontFamily.en;

	updateGUI();
	renderText();
}
