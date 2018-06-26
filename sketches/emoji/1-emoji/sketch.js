var font = null;
var fontFileName = 'data/emojis_HBBGX.ttf';
var fontAxes = [];

// Text input element
var faceElement = document.getElementById('face');

// Create GUI for tweaking values during runtime
var gui = QuickSettings.create(10, 10, 'settings', document.getElementById('sliders'));
gui.setDraggable(false);
gui.setCollapsible(false);
gui.setGlobalChangeHandler(renderText);

function renderText() {
	if (!font) return;

	// Apply variable font settings
	faceElement.style.fontVariationSettings = fontAxes.map(function (axis) {
		return '"' + axis.tag + '" ' + axis[axis.tag];
	}).join(', ');
}

function updateGUI() {
	// Create sliders for each variable font axis
	fontAxes.forEach(function(axis) {
		gui.bindRange(axis.tag, axis.minValue, axis.maxValue, axis.defaultValue, 0.01, axis);
	});

	gui.addButton('print', exportPrint);
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

	// Add current value at value of default axis value.
	fontAxes = font.tables.fvar.axes;
	fontAxes = fontAxes.map(function(axis) {
		axis[axis.tag] = axis.defaultValue;
		return axis;
	});

	// Use fornt for text input area
	document.getElementById('font-styles').innerText =
		'@font-face {font-family:"' + font.names.fontFamily.en + '"; ' +
		'src: url("' + fontFileName + '") format("truetype");}';
	faceElement.style.fontFamily = font.names.fontFamily.en;

	updateGUI();
	renderText();
}

function exportPrint() {
	// TODO create print CSS page styling

	window.print();
}

loadFontFile();
