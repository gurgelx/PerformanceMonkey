var http = require('http');

var createResponse = function(startTime, response){
	return {
		status: response.statusCode,
		timeTaken: new Date().getTime() - startTime.getTime()  		
	};
};

exports.runRequest = function(host, path, port, callback){
	console.log("Calling: " + host + path);
	var startTime = new Date();
	http.request({host: host, path: + path, port: + port},  function(response){
		var result = createResponse(startTime,response); 
		callback(result);
		console.log(result.status + ' ' + result.timeTaken);
	});
};

