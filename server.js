var express = require('express'),
app = express(),
sessionManager = require('./session_manager.js');

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

app.get('/sse/:token', function(req, res){
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});

	sessionManager.connect(req, res);

	var send = function(){
		sessionManager.push(req.params.token, {token: req.params.token, date: (new Date()).getTime()});
	};

	var interval = setInterval(send, 3000);

	function clear(){
		clearInterval(interval);
	}

	req.on('timeout', function() {
		console.log("timeout", req.params.token);
		clear();
	});
	req.on('error', function() {
		console.log("error", req.params.token);
		clear();
	});
	req.on('close', function() {
		console.log("close", req.params.token);
		clear();
	});
});


console.log('Access Server listening on port ' + (process.argv[2] || 3000));
app.listen( (process.argv[2] || 3000) );