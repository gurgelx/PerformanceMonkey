var fs = require("fs");
var separator = '\t';
var outputFile = "result.log";

var appendFile = function(str) {
	fs.appendFile(outputFile, str, function(err){
		if(err) console.log(err);		
	});	
};

var createRow = function(logItem) {
	var diff = logItem.requestTimeTaken - logItem.result.timeTaken;
	return [logItem.requestPath, logItem.responseStatus, logItem.requestTimeTaken, logItem.result.status, logItem.result.timeTaken, diff].join(separator) + "\r\n";	
};

exports.clean = function () {
	fs.writeFileSync(outputFile, "");
};

exports.logTotal = function(str){
	appendFile(str);
}
exports.logResult = function(logItem){
	appendFile(createRow(logItem));
};