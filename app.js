var logs = require('./logFiles');
var player = require('./logPlayer');
var requestMaker = require('./requestMaker');
var logWriter = require('./logWriter');
var resultList, logList, requestCount, requestSuccessCount, logPos = 0;

var timer = 10;
var speedInPercent = 0.05;
var host = 'demo-generic-product.kuoninordic.com';
var logFile = 'u_ex150629.log';

var startPerformanceTests = function(result){
	var stopTime = timer * 1000 * 60;
	requestCount = 0;
	requestSuccessCount = 0;
	logList = result;	
	resultList = [];
	console.log('Running ' + logList.length + ' rows, in ' + stopTime + 'ms');
	setTimeout(stop, stopTime);		
	player.run(logList, onPlayerLogRequestBegin, onPlayerLogRequestResult, speedInPercent);
		
};

var onPlayerLogRequestBegin = function(item){	
	requestCount++;
	console.log("running: " + item.requestPath);	
};

var onPlayerLogRequestResult = function(result){
	if(!player.isRunning()) return;
	
	requestSuccessCount++;
	var logItem = logList[result.rowNumber];
	logItem.result = result;	
	logWriter.logResult(logItem);	
};

var stop = function(){
	player.stop();
	var total = "Sent: " + requestCount + " successed: " + requestSuccessCount;
	console.log(total)
	logWriter.logTotal(total);
};


player.setHost(host);
logWriter.clean();
logs.loadFile(logFile, startPerformanceTests);



