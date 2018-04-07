var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  console.log('no webkit speech recognition');
}

var recognition = {};

function listen() {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + sentences[0] +';';
  recognition = new webkitSpeechRecognition();
  var speechRecognitionList = new webkitSpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.start();
  ignore_onend = false;
  start_timestamp = new Date().getTime();
}

recognition.onstart = function() {
  console.log('starting');
  recognizing = true;
};

recognition.onerror = function(event) {
  if (event.error == 'no-speech') {
    console.log('no speech');
    ignore_onend = true;
  }
  if (event.error == 'audio-capture') {
    console.log('no mic');
    ignore_onend = true;
  }
  if (event.error == 'not-allowed') {
    if (event.timeStamp - start_timestamp < 100) {
    	console.log('info blocked');
    } else {
      console.log('info denied');
    }
    ignore_onend = true;
  }
};

recognition.onend = function() {
  recognizing = false;
  if (ignore_onend) {
    return;
  }
};

failCount = 0;
recognition.onresult = function(event) {
  for (var i = event.resultIndex; i < event.results.length; ++i) {

    var allPresented = words[sentenceCount],
        currentPresented = words[sentenceCount][wordCount].replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""),
        allDetected = event.results[i][0].transcript.split(' '),
        currentDetected = '';

    if (!event.results[i].isFinal) {
      for (var j = 0; j < allDetected.length; j++) {
        currentDetected = allDetected[j];
  			if ( currentDetected.toUpperCase() == currentPresented.toUpperCase() ) {
          previousPresented = currentPresented;
  				react();
  			}
    	}
    } else {
      currentDetected = allDetected[allDetected.length - 1];
      if ( previousPresented && currentDetected.toUpperCase() != previousPresented.toUpperCase() ) {
        if ( currentDetected.toUpperCase() != currentPresented.toUpperCase() ) {
          if ( failCount < 2 ) {
            $('#message').html( 'Sorry! I heard "' + currentDetected + '" instead of "' + currentPresented + '."' );
            $('#message').css('opacity', 1);
            setTimeout(function () {
              $('#message').css('opacity', 0);
            }, 3000);
            failCount++;
            return;
          } else {
            react();
            failCount = 0;
            return;
          }
        }
      }
    }
  }
};

listen();
