var fs = require("fs");
var filter = ['.js','.jpg','.png','.gif','.woff','.css','.png'];

var openAndParseFile = function(path, callback){
	
	fs.stat(path, function(error, stats){
		fs.open(path, "r", function(error, fd){
			var buffer = new Buffer(stats.size);			
			fs.read(fd, buffer, 0, buffer.length, null, function(error, bytes){
				var str = buffer.toString("utf8", 0, buffer.length);
				callback(parseFile(str));				
			});			
		});
	});
};

var parseFile = function(data){
	var lines = [];
	var rows = data.split('\n');
	for(var r in rows){
		if(!isValid(rows[r])) continue;
		var log = getLogObject(rows[r]);
		if(isFiltered(log)) continue;		
		lines.push(log);
	}	
	return lines;	
};

var isFiltered = function(logObj){
	if(logObj  === undefined ) return true;
	if(logObj.requestPath === undefined) return true;
	
	for(var k in filter){		
		var suffix = filter[k];
		if(logObj.requestPath.length < suffix.length) continue;
		if(logObj.requestPath.indexOf(suffix, logObj.requestPath.length - suffix.length) !== -1) return true;
	}
	return false;	
};

var getLogObject = function(str){
	return {
		raw: str,
		requestPath: getRequestPath(str),
		requestPort: getRequestPort(str),
		requestTime: getRequestTime(str),
		requestTimeTaken: getTimeTaken(str),
		responseStatus: getResponseStatus(str)					
	};
};

var getRequestTime = function(str){
	return new Date(getLogPart(0, str) + ' ' + getLogPart(1, str)); 
};

var getRequestPath = function(str){
	var path = getLogPart(4, str); 
	var query = getLogPart(5, str);
	if(query !== '-') path += '?' + query;
	
	return path;
};

var getResponseStatus = function(str){
	return getLogPart(11, str);
};

var getTimeTaken = function(str){
	return parseInt(getLogPart(14, str));
};

var getRequestPort = function(str){
	return parseInt(getLogPart(6, str));
};

var isValid = function(str){
	if(str.substr(0,1) === "#") return false;
	if(str.length < 20) return false;	
	return true;
};

var getLogPart = function(part, str){
	return str.split(' ')[part];	
};

exports.loadFile = function(path, callback){
	openAndParseFile(path, function(data){
		callback(data);
	});
};