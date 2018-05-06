var font = null;
var fontSize = 60;
var textAlign = 'left';
var textToRender = "Pa's wijze lynx bezag vroom het fikse aquaduct";
var fontFileName = 'data/KairosSans_Variable.ttf';
var wordBreak = false;
var textColor = '#d3d3d3';
var backgroundColor = '#2f4f4f';
var fontAxes = [];

var textElement = document.getElementById('text');
textElement.innerText = textToRender;

var gui = QuickSettings.create(10, 10);
gui.addHTML('font info', '');
gui.addFileChooser('font file name', fontFileName, '*', loadFontFile);
gui.bindRange('fontSize', 0, 200, fontSize, 0.01, this);
gui.bindDropDown('textAlign', ['left', 'right', 'center', 'justify', 'start', 'end'], this);
gui.bindBoolean('wordBreak', wordBreak, this);
gui.bindColor('textColor', textColor, this);
gui.bindColor('backgroundColor', backgroundColor, this);
gui.setGlobalChangeHandler(renderText);

function renderText() {

	if (!font) return;

	document.body.style.backgroundColor = backgroundColor;
	textElement.style.fontSize = fontSize + 'pt';
	textElement.style.textAlign = textAlign;
	textElement.style.wordBreak = wordBreak ? 'break-all' : '';
	textElement.style.color = textColor;
	textElement.style.fontVariationSettings = fontAxes.map(function (axis) {
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

	// Add current value at value of default axis value.
	fontAxes = font.tables.fvar.axes;
	fontAxes = fontAxes.map(function(axis) {
		axis[axis.tag] = axis.defaultValue;
		return axis;
	});

	document.getElementById('font-styles').innerText =
		'@font-face {font-family:"' + font.names.fontFamily.en + '"; ' +
		'src: url("' + fontFileName + '") format("truetype");}';
	textElement.style.fontFamily = font.names.fontFamily.en;

	updateGUI();
	renderText();
}

loadFontFile();
