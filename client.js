var EventSource = require('eventsource');


var url = (process.argv[3] || 'http://localhost:3000/sse/')+ (process.argv[2] || ((Math.floor(Math.random() * 10)) + 1));
console.log(url);
var sse = new EventSource(url);

sse.onmessage = function(e) {
	console.log(e.data);
};

sse.onerror = function(e){
	console.log('error', e);
};