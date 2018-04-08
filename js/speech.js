var recognition;
var recognizing = false;

function listen() {
  if (!('webkitSpeechRecognition' in window)) {
    console.log('no webkit speech recognition');
    return;
  }
  var ignore_onend = false;
  var start_timestamp = new Date().getTime();
  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + sentences[sentenceCount] +';';
  recognition = new webkitSpeechRecognition();
  var speechRecognitionList = new webkitSpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  console.log(speechRecognitionList);
  recognition.lang = 'en-US';
  recognition.grammars = speechRecognitionList;
  recognition.continuous = true;
  recognition.interimResults = true;

  if (recognizing) {
    recognition.stop();
    return;
  }

  recognition.onstart = function() {
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

  var failCount = 0;
  recognition.onresult = function(event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {

      var allPresented = words[sentenceCount],
          currentPresented = words[sentenceCount][wordCount].replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""),
          allDetected = event.results[i][0].transcript.split(' '),
          currentDetected = '',
          previousPresented = '';

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
        if ( currentDetected.toUpperCase() != previousPresented.toUpperCase() ) {
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
  recognition.start();
}
