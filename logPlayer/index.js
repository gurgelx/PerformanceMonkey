var http = require('http');
var host = '';

var running = false;
var threads = [];

var onStart = function() {};
var onResult = function() {};

var runLogItem = function(item, delay, pos){
	threads[pos] = setTimeout(function(){
		if(!running) return;
		onStart(item);
		runRequest(item, onResult, pos);		
	}, delay);
};

var createResponse = function(startTime, response, pos){
	return {
		rowNumber: pos,
		status: response.statusCode,
		timeTaken: new Date().getTime() - startTime.getTime()  		
	};
};

var runRequest = function(item, callback, pos){		
	var startTime = new Date();	
	var options = createOptions(item, host);
	var req = http.request(options,  function(response){
		  
		response.on('data', function (chunk) {});	
		response.on('end', function () {});
		
		var result = createResponse(startTime, response, pos);
		callback(result);
	});
	req.shouldKeepAlive = false;
	req.end();
};

var createOptions = function(item, host){
	return {host: host, path: item.requestPath, port: item.requestPort};
};

var createFiddlerOption = function(item, host){
	return {
		path: 'http://' + host + ':' + item.requestPort + item.requestPath,
		host: '127.0.0.1',
		headers:{host: host},
		port: 8888						
	};	
};

exports.setHost = function(data){
	host = data;
};

exports.run = function(logList, startCallback, resultCallback, throttle){
	running = true;
	onStart = startCallback;
	onResult = resultCallback;	
	
	var now = logList[0].requestTime.getTime();	
	for(var l in logList){		
		var delay = (logList[l].requestTime.getTime() - now) / throttle;		
		runLogItem(logList[l], delay, l);		
	}
};

exports.stop = function(){
	running = false;
	for(var i in threads){
		clearTimeout(threads[i]);				
	}
};

exports.isRunning = function(){
	return running;
}
