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

	imageFile.loadPixels();
	var sampledPixels = [];
	for (var i = 0, offset, r, g, b, a; i < imageFile.pixels.length; i += sampleQuality) {
		offset = i * 4;
		r = imageFile.pixels[offset + 0];
		g = imageFile.pixels[offset + 1];
		b = imageFile.pixels[offset + 2];
		a = imageFile.pixels[offset + 3];
		if (a >= 125) {
			if (!(r > 250 && g > 250 && b > 250)) {
				sampledPixels.push([r, g, b]);
			}
		}
	}
	var cmap = MMCQ.quantize(sampledPixels, sampleColorCount);
	var backgroundColor = (cmap ? color(cmap.palette()[0]) : color(0)).toString()
	background(backgroundColor);

	// Fit image proportionally
	if (imageFile.width < imageFile.height) {
		imageFile.resize(0, height);;
	} else {
		imageFile.resize(width, 0);
	}
	image(imageFile, 0, 0);

	// Get image title
	var title = imageData.getChild('file').getChild('name').content;
	// Remove file extension from title
	title = title.substr(0, title.lastIndexOf('.')) || title;

	// Get image date
	var date = imageData.getChild('file').getChild('date').content.replace(/^.+">|<\/time.+/g, '');
	// Convert to date object data
	date = new Date(date);

	// If images dates from before the year 2000, use a serif font, else use Helvetica Bold
	if (date.getFullYear() < 2000) {
		textFont('serif');
	} else {
		textFont('helvetica-bold');
	}

	noStroke();
	fill(backgroundColor);
	textSize(60);

	// Rotate title 90 degrees (π ÷ 2 in radians) when image is taller than it is wide
	push();
	if (imageFile.width < imageFile.height) {
		rotate(HALF_PI);
	} else {
		translate(0, imageFile.height);
	}

	textAlign(LEFT, BOTTOM);
	text(title, 0, 0);
	pop();

	// Show author
	textSize(20);
	textAlign(RIGHT, BOTTOM);
	text(imageData.getChild('file').getChild('author').content.replace(/<[^>]*>/g, '').trim(), imageFile.width, imageFile.height);

	// Show location coordinates, if defined
	if (imageData.getChild('file').getChild('location')) {
		var locationText = imageData.getChild('file').getChild('location').children.map(cord => {
			return cord.content;
		}).join('\n');
		textAlign(RIGHT, TOP);
		text(locationText, imageFile.width, 0);
	}

	// Show image description
	textAlign(LEFT, TOP);
	fill(255);
	text(imageData.getChild('description').content.replace(/<[^>]*>/g, '').trim(), imageFile.width, 0);

	// Show list of categories the image belongs to
	textAlign(LEFT, BOTTOM);
	fill(255);
	var categories = imageData.getChild('categories').children.map(category => {
		return category.content;
	}).join('\n');
	text(categories, imageFile.width, height);
}
