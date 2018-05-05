var font = null;
var fontSize = 60;
var textToRender = "Pa's wijze lynx bezag vroom het fikse aquaduct";
var fontFileName = 'data/KairosSans_Variable.ttf';
var fontAxes = [];

var pElement = document.getElementById('p');
pElement.innerText = textToRender;

var gui = QuickSettings.create(10, 10);
gui.addHTML('font info', '');
gui.addFileChooser('font file name', 'font file', '*', loadFontFile);
gui.bindRange('fontSize', 0, 200, fontSize, 0.1, this);
gui.setGlobalChangeHandler(renderText);

function renderText() {
	if (!font) return;
	pElement.style.fontSize = fontSize + 'pt';
	pElement.style.fontVariationSettings = fontAxes.map(function (axis) {
		return '"' + axis.tag + '" ' + axis[axis.tag];
	}).join(', ');
}

function updateGUI() {

	// Show font info
	var axesNames = fontAxes.map(function(axis) {
		return axis.tag + ' (' + axis.name.en + ')';
	}).join('\n');
	gui.setValue('font info',
		'<pre>' +
		font.names.fontFamily.en + '\n\n' +
		'<b>' + font.tables.fvar.axes.length + ' axes:</b>\n' +
		axesNames +
		'</pre>'
	);

	// Add axes
	fontAxes.forEach(function(axis) {
		gui.bindRange(axis.tag, axis.minValue, axis.maxValue, axis.defaultValue, 0.01, axis);
	});
}

function loadFontFile(file) {
	console.log(file);
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

	// Remove old axes from UI
	fontAxes.forEach(function (axis) {
		gui.removeControl(axis.tag);
	});

	fontAxes = font.tables.fvar.axes;
	fontAxes = fontAxes.map(function(axis) {
		axis[axis.tag] = axis.defaultValue;
		return axis;
	});

	document.getElementById('font-styles').innerText =
		'@font-face {font-family:"' + font.names.fontFamily.en + '"; ' +
		'src: url("' + fontFileName + '") format("truetype");}';
	pElement.style.fontFamily = font.names.fontFamily.en;

	updateGUI();
	renderText();
}

loadFontFile();
