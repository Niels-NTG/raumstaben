// Simple sketch demonstrating speech recognition using the [p5.Speech](http://ability.nyu.edu/p5.js-speech/) library and natural language processing using [RiTa](https://rednoise.org/rita/reference/). For more information on working with RiTa natural language processing, see this video by Daniel Shiffman https://www.youtube.com/watch?v=lIPEvh8HbGQ.

var textElement;

var speechRec;
var lang = navigator.language || 'en-US';

// PENN tags https://rednoise.org/rita/reference/PennTags.html
var posTagList = {
	'cc': 'Coordinating conjunction',
	'cd': 'Cardinal number',
	'dt': 'Determiner',
	'ex': 'Existential there',
	'fw': 'Foreign word',
	'in': 'Preposition or subordinating conjunction',
	'jj': 'Adjective',
	'jjr': 'Adjective, comparative',
	'jjs': 'Adjective, superlative',
	'ls': 'List item marker',
	'md': 'Modal',
	'nn': 'Noun, singular or mass',
	'nns': 'Noun, plural',
	'nnp': 'Proper noun, singular',
	'nnps': 'Proper noun, plural',
	'pdt': 'Predeterminer',
	'pos': 'Possessive ending',
	'prp': 'Personal pronoun',
	'prp$': 'Possessive pronoun',
	'rb': 'Adverb',
	'rbr': 'Adverb, comparative',
	'rbs': 'Adverb, superlative',
	'rp': 'Particle',
	'sym': 'Symbol',
	'to': 'to',
	'uh': 'Interjection',
	'vb': 'Verb, base form',
	'vbd': 'Verb, past tense',
	'vbg': 'Verb, gerund or present participle',
	'vbn': 'Verb, past participle',
	'vbp': 'Verb, non-3rd person singular present',
	'vbz': 'Verb, 3rd person singular present',
	'wdt': 'Wh-determiner',
	'wp': 'Wh-pronoun',
	'wp$': 'Possessive wh-pronoun',
	'wrb': 'Wh-adverb'
};

function setup() {
	noCanvas();

	// Create text element on the page
	textElement = createDiv('say something');
	analyzeText('say something');

	// Setup speech recognition
	speechRec = new p5.SpeechRec(lang);

	// Show speech recognition results in textElement
	speechRec.onResult = onSpeak;

	// Whether the speech recognition engine will give results continuously (true) or just once (false = default)
	speechRec.continuous = true;

	// Whether the speech recognition engine will give faster, partial results (true) or wait for the speaker to pause (false = default)
	speechRec.interimResults = true;

	// Start listening for speech
	speechRec.start();
}

function onSpeak() {
	var resultString = speechRec.resultString;
	console.log(resultString, '\n(' + speechRec.resultConfidence * 100 + '% confidence)');
	textElement.html(resultString);
	analyzeText(resultString);
}

function analyzeText(resultString) {
	var rs = new RiString(resultString);
	rs.analyze();

	var wordsWithTags = rs.words().map(word => {
		var fullPosTags = RiTa.getPosTags(word).map(tag => {
			return posTagList[tag];
		}).join(' ');
		return '<span title="' + fullPosTags + '">' + word + ' </span>';
	}).join('');
	textElement.html(wordsWithTags);
}
