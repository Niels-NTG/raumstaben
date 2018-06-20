// Generate poster for a random image from Wikipedia. To get a new image random image, open a terminal window in the 1-random-image folder, then run the command `sh get-image.sh`.

var imageData;
var imageFile;

var sampleColorCount = 100;
var sampleQuality = 1;

function preload() {
	imageData = loadXML('data/imageData.xml', function(result) {
		imageFile = loadImage(result.getChild('file').getChild('urls').getChild('file').getContent());
	});
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	// Get average color from image.
	var sampledColor = sampleImageColor();

	// Get image imageTitle.
	var imageTitle = getImageTitle();

	// Get image date information.
	var date = getDate();

	// Get author information.
	var author = getAuthor();

	// Get geolocation coordinates information, if available.
	var coordinates = getCoordinates();

	// Get image description text.
	var imageDescription = getImageDescription();

	// Get image category listing.
	var imageCategories = getImageCategories();

	// Set background
	background(sampledColor);

	// Fit image proportionally
	if (imageFile.width < imageFile.height) {
		imageFile.resize(0, height);;
	} else {
		imageFile.resize(width, 0);
	}
	image(imageFile, 0, 0);

	// If images dates from before the year 2000, use a serif font, else use Helvetica Bold
	if (date.getFullYear() < 2000) {
		textFont('serif');
	} else {
		textFont('helvetica-bold');
	}

	noStroke();
	fill(sampledColor);
	textSize(60);

	// Rotate imageTitle 90 degrees (π ÷ 2 in radians) when image is taller than it is wide
	push();
	if (imageFile.width < imageFile.height) {
		rotate(HALF_PI);
	} else {
		translate(0, imageFile.height);
	}

	textAlign(LEFT, BOTTOM);
	text(imageTitle, 0, 0);
	pop();

	// Show author
	textSize(20);
	textAlign(RIGHT, BOTTOM);
	text(author, imageFile.width, imageFile.height);

	// Show location coordinates, if defined
	textAlign(RIGHT, TOP);
	text(coordinates, imageFile.width, 0);

	// Show image description
	textAlign(LEFT, TOP);
	fill(255);
	text(imageDescription, imageFile.width, 0);

	// Show list of categories the image belongs to
	textAlign(LEFT, BOTTOM);
	fill(255);
	text(imageCategories, imageFile.width, height);
}

function sampleImageColor() {
	imageFile.loadPixels();
	var sampledPixels = [];
	var pixelCount = imageFile.pixels.length / 4;
	for (let i = 0, offset, r, g, b; i < pixelCount; i += sampleQuality) {
		offset = i * 4;
		r = imageFile.pixels[offset + 0];
		g = imageFile.pixels[offset + 1];
		b = imageFile.pixels[offset + 2];
		if (!(r > 200 && g > 200 && b > 200)) {
			sampledPixels.push([r, g, b]);
		}
	}
	var cmap = MMCQ.quantize(sampledPixels, sampleColorCount);
	return cmap ? color(cmap.palette()[0]) : color(0);
}

function getImageTitle() {
	var imageTitle = imageData.getChild('file').getChild('name').content;
	// Remove file extension from imageTitle
	return imageTitle.substr(0, imageTitle.lastIndexOf('.')) || imageTitle;
}

function getDate() {
	var date = imageData.getChild('file').getChild('date').content.replace(/^.+">|<\/time.+/g, '');
	// Convert to date object data. See https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date.
	return new Date(date);
}

function getAuthor() {
	return imageData.getChild('file').getChild('author').content.replace(/<[^>]*>/g, '').trim();
}

function getCoordinates() {
	var coordinates = '';
	if (imageData.getChild('file').getChild('location')) {
		coordinates = imageData.getChild('file').getChild('location').children.map(cord => {
			return cord.content;
		}).join('\n');
	}
	return coordinates;
}

function getImageDescription() {
	return imageData.getChild('description').content.replace(/<[^>]*>/g, '').trim();
}

function getImageCategories() {
	return imageData.getChild('categories').children.map(category => {
		return category.content;
	}).join('\n');
}
