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
    console.log('SpeechRecognition.onstart');
    recognizing = true;
  };

  recognition.onerror = function(event) {
    console.log('SpeechRecognition.onerror');
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
    console.log('SpeechRecognition.onend');
    recognizing = false;
    if (ignore_onend) {
      return;
    }
  };

  var failCount = 0;
  recognition.onresult = function(event) {
    console.log('SpeechRecognition.onresult');
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






  recognition.onspeechend = function() {
    console.log('SpeechRecognition.onspeechend');
  }

  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }

  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }

  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }

  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }

  recognition.onsoundstart = function(event) {
      //Fired when any sound � recognisable speech or not � has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }

  recognition.onsoundend = function(event) {
      //Fired when any sound � recognisable speech or not � has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }

  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }







  recognition.start();
}
