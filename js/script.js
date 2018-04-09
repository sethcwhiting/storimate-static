// Specify data to be incremented
var sentenceCount = 0,
		wordCount = 0,
		elementCount = 0,
		intervalCount = 0;

// Check for discrepancies in array lengths and begin
function safeStart() {
	if ( timeIntervals.length === sentences.length ) {
		listen();
		displayText();

		var bgAudio = new Audio('https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3');
		bgAudio.play();

	} else {
		console.log('You must declare exactly as many time intervals as sentences.');
		return;
	}
}

// Display the words of a sentence
function displayText() {
	$('#caption').html('');
	for (var i = 0; i < words[sentenceCount].length; i++) {
		$('#caption').append('<li>'+ words[sentenceCount][i] +'</li>');
		$('#caption').css('opacity', 1);
		elementCount++;
	}
}

// Perform actions related to given word
var checked = false;
function react() {
	if ( (wordCount + 1) < words[sentenceCount].length ) {
		deactivateWord();
		wordCount++;
	} else {
		// Make sure it only runs once
		if ( !checked ) {
			deactivateWord();
			playSegment();
			checked = true;
		}
	}
}

// Deactivate the selected word
function deactivateWord() {
	$('#caption li:nth-child('+ (wordCount + 1) +')').addClass('deactivated');
}

// Play video for specified amount of time
function playSegment() {
	recognition.stop();
	$('#caption').css('opacity', 0);
	setTimeout(function() {
		$('#caption').html('');
	}, 500);
	player.playVideo();
	setTimeout(function() {
		freeze();
		nextSentence();
		listen();
	}, timeIntervals[intervalCount]);
	intervalCount++;
}

// Load the next sentence
function nextSentence() {
	if ( sentenceCount + 1 < sentences.length ) {
		sentenceCount++;
		elementCount = 0;
		wordCount = 0;
		checked = false;
		displayText();
	} else {
		$('#caption').html('The end.');
  	recognition.stop();
	}
}
