var timeIntervals = [],
		sentences = [],
		words = [];

$.getJSON('data/data.json').done(function(data){

	$.each(data.segments, function() {
		timeIntervals.push(this.time);
		sentences.push(this.phrase);
	});

  for (var i = 0; i < sentences.length; i++) {
  	words.push(sentences[i].split(' '));
  }

}).fail(function(jqxhr, textStatus, error) {
	console.log(error);
});
