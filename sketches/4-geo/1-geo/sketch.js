// Simple demo of geolocation technology using a single circular geo fence. See https://github.com/bmoren/p5.geolocation for documentation.

var geoFence;
var targetLocationLatitude = 51.491388;
var targetLocationLongitude = 7.041333;
var targetRadius = 1;

var maxRadius = 200;

function setup() {
	createCanvas(windowWidth, windowHeight);

	// Draw circles each representing a 10 kilometer increment.
	for (let i = 0; i < maxRadius; i += 10) {
		let screenRadius = map(i, 0, maxRadius, 0, width);
		strokeWeight(0.1);
		stroke(0);
		noFill();
		ellipse(0, height / 2, screenRadius * 2, screenRadius * 2);

		// Draw kilometer text label only every 20 kilometers.
		if (i % 20 === 0) {
			noStroke();
			fill(0);
			text(i, screenRadius, (height / 2) - 8);
		}
	}

	// Circle representing target coordinates.
	fill(0);
	ellipse(0, height / 2, 4, 4);

	// Draw targetRadius
	var screenTargetDiameter = map(targetRadius, 0, maxRadius, 0, width) * 2;
	noFill();
	stroke(0, 255, 0);
	strokeWeight(1);
	ellipse(0, height / 2, screenTargetDiameter, screenTargetDiameter);

	// Create a circular geo fence, an virtual round area the user can be inside or outside of.
	geoFence = new geoFenceCircle(
		// lat, long
		targetLocationLatitude, targetLocationLongitude,
		// radius in kilometers
		targetRadius,
		// if inside radius
		insideFence,
		// if outside radius
		outsideFence,
		// unit type
		'km'
	);
}

function insideFence(position) {
	console.log('inside geo fence', position);
	showPosition(position, true);
}

function outsideFence(position) {
	console.log('outside geo fence', position);
	showPosition(position, false);
}

function showPosition(position, isInside) {

	// Calculate distance from target coordinates.
	var geoDistance = calcGeoDistance(
		targetLocationLatitude, targetLocationLongitude,
		position.latitude, position.longitude,
		'km'
	);
	console.log('distance to target (km)', geoDistance);

	// Show distance on screen with a green dot if inside the area, red if outside.
	var screenDistance = map(geoDistance, 0, maxRadius, 0, width);
	noStroke();
	if (isInside) {
		fill(0, 255, 0);
	} else {
		fill(255, 0, 0);
	}
	ellipse(screenDistance, height / 2, 4, 4);
}

function keyPressed() {
	if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
