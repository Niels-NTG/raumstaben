var mic;
var fft;
var fftEnergy = ['none', 'bass', 'lowMid', 'mid', 'highMid', 'treble'];

var font = null;
var fontSize = 60;
var textAlignment = 'center';
var textToRender = "Pa's wijze lynx bezag vroom het fikse aquaduct";
var fontFileName = 'data/KairosSans_Variable.ttf';
var wordBreak = false;
var textColor = '#d3d3d3';
var backgroundColor = '#2f4f4f';
var fontAxes = [];

var textElement;

var gui;

function setup() {
	noCanvas();

	mic = new p5.AudioIn();
	mic.start();
	fft = new p5.FFT();
	fft.setInput(mic);

	textElement = createDiv(textToRender);
	textElement.attribute('contenteditable', true);
	textElement = textElement.elt;
	textElement.style.outline = 'none';
	textElement.style.width = 'inherit';

	gui = QuickSettings.create(10, 10);
	gui.addHTML('font info', '');
	gui.addFileChooser('font file name', fontFileName, '*', loadFontFile);
	gui.bindRange('fontSize', 0, 200, fontSize, 0.01, window);
	gui.bindDropDown('textAlignment', ['center', 'justify', 'left', 'right', 'start', 'end'], window);
	gui.bindBoolean('wordBreak', wordBreak, window);
	gui.bindColor('textColor', textColor, window);
	gui.bindColor('backgroundColor', backgroundColor, window);
	gui.setGlobalChangeHandler(renderText);

	loadFontFile();
}

function draw() {
	fft.analyze();
	setFontAxisValue();
}

function setFontAxisValue() {
	if (!font) return;
	fontAxes.forEach(function (axis) {
		if (axis[axis.tag + '_input'] !== 'none') {
			axis[axis.tag] = map(
				fft.getEnergy(axis[axis.tag + '_input']),
				0, 255,
				axis.minValue, axis.maxValue
			);
		} else {
			axis[axis.tag] = axis.defaultValue;
		}
	});
	renderText();
	updateGUI();
}

function renderText() {
	document.body.style.backgroundColor = backgroundColor;
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
	var axesInfo = fontAxes.map(function (axis) {
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
	opentype.load(fontFileName, function (err, font) {
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
		gui.removeControl(axis.tag + '_input');
	});

	// Add current value at value of default axis value.
	fontAxes = font.tables.fvar.axes;
	fontAxes = fontAxes.map(function (axis) {
		axis[axis.tag] = axis.defaultValue;
		axis[axis.tag + '_input'] = 'none';
		return axis;
	});

	document.getElementById('font-styles').innerText =
		'@font-face {font-family:"' + font.names.fontFamily.en + '"; ' +
		'src: url("' + fontFileName + '") format("truetype");}';
	textElement.style.fontFamily = font.names.fontFamily.en;

	fontAxes.forEach(function (axis) {
		gui.bindDropDown(axis.tag + '_input', fftEnergy , axis);
	});

	updateGUI();
	renderText();
}
