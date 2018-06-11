// Simple sketch demonstrating speech recognition and text to speech using the [p5.Speech](http://ability.nyu.edu/p5.js-speech/) library.

var textElement;

var speechRec;
var speech;
var lang = navigator.language || 'de';

function setup() {
	noCanvas();

	// Setup speech synth
	speech = new p5.Speech();
	speech.setLang(lang);

	// Create text element on the page
	textElement = createDiv('say something');

	// Setup speech recognition
	speechRec = new p5.SpeechRec(lang);

	// Show speech recognition results in textElement
	speechRec.onResult = onSpeak;

	// Whether the speech recognition engine will give results continuously (true) or just once (false = default)
	speechRec.continuous = false;

	// Whether the speech recognition engine will give faster, partial results (true) or wait for the speaker to pause (false = default)
	speechRec.interimResults = false;

	// Start listening for speech
	speechRec.start();
}

function onSpeak() {
	console.log(speechRec.resultString, '\n(' + speechRec.resultConfidence * 100 + '% confidence)');
	textElement.html(speechRec.resultString);
	sayText();
}

function sayText() {
	speech.speak(speechRec.resultString);
}
