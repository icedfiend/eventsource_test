var session_manager = {};

(function(){
	var sessions = {};

	session_manager.connect = function(request, response){
		var token = request.params.token;

		if(!sessions[token]){
			sessions[token] = [];
		}
		sessions[token].push(response);

		function clear(){
			console.log('Clear', token);
			var s = sessions[token];
			s.splice(s.indexOf(response), 1);
			console.log('disconnect', token, sessions[token].length);
			if (s.length === 0) {
				delete sessions[token];
				console.log("delete", sessions[token]);
			}
		}

		console.log('connect',token, sessions[token].length);

		request.on('timeout', clear);
		request.on('error', clear);
		request.on('close', clear);
	};

	function pushMessage(request, message){
		request.write('data: ' + JSON.stringify(message) + '\n\n');
	}

	session_manager.push = function(token, message){
		if(!sessions[token]){
			return false;
		}
console.log( 'push', token, message );
		for (var res in sessions[token]){
			var request = sessions[token][res];
			pushMessage(request, message);
		}
		return true;
	};

	session_manager.isInSession = function(token){
		return (sessions[token] === undefined);
	};

	session_manager.clear = function(){
		sessions = {};
	};
})();

module.exports = session_manager;
