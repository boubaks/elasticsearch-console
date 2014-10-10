var utils = require(__dirname + '/../lib/utils');
var logger = require(__dirname + '/../lib/logger');
var getopt = require('node-getopt');
var readline = require('readline');
var ELSCLIENT = require(__dirname + '/../lib/ElsClient').ElsClient;
var ELSQUERY = require(__dirname + '/../lib/ElsQuery').ElsQuery;

/*
** V1 elasticsearch-console
**
** show indexes;
** find --query (query, type, options);
** insert --query (query, type, options);
** remove --query (query, type, options);
** update --query (id, query, options);
** count (query, type);
** ping
*/

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.setPrompt('elasticsearch-console> ');
var opt = getopt.create([
    ['p', 'port=ARG', 'port to connect to'],
    ['', 'host=ARG', 'server to connect to'],
    ['h', 'help', 'display this help'],
    ['v', 'version', 'show version']
])
    .bindHelp()
    .parseSystem();

var port = opt.options.port ? opt.options.port : 9200;
var host = opt.options.host ? opt.options.host : 'localhost';

var elsClient = undefined;
var elsQuery = undefined;
new ELSCLIENT(host, port, function(tmpClient, msg) {
    if (!tmpClient)
	throw('Couldn\'t connect to ELS');
    var scope = this;
    elsClient = tmpClient;
    rl.prompt();
});
new ELSQUERY(function(tmpQuery) {
    elsQuery = tmpQuery;
});

function getParams(cmd) {
    console.log('getParams');
}

var handleFind = function(elsClient, cmd, callback) {
    logger.info('handleFind');
    getParams(cmd);
    /*
    elsQuery.generate(type, query, null, {term: true}, function(err, queryELS) {
	callback(err, queryELS);
	elsQuery.deleteHandle(0, true);
	elsClient.search(index, queryELS, null, function(err, res) {
	    callback();
	});
    });
    */
};

var handleRemove = function(elsClient, cmd, callback) {
    logger.info('handleRemove');
    getParams(cmd);
};

var handleUpdate = function(elsClient, cmd, callback) {
    logger.info('handleUpdate');
    getParams(cmd);
};

var handleInsert = function(elsClient, cmd, callback) {
    logger.info('handleInsert');
    getParams(cmd);
};

var handlePing = function(elsClient, cmd, callback) {
    elsClient._client.ping({
	requestTimeout: 1000,
	hello: "elasticsearch!"
    }, function (err, response, status) {
	if (err) {
            logger.error('elasticsearch cluster is down!', err);
            callback();
	} else {
            logger.info("ELS connected - status: " + status);
	    callback();
	}
    });
}

var execCmd = {
    // ELS server infos
    'ping': handlePing,

    // ELS db actions
    'find': handleFind,
    'remove': handleRemove,
    'update': handleUpdate,
    'insert': handleInsert
};

function getCmd(line) {
    var results = [];
    var cmds = line.split(';');
    
    for (i in cmds) {
	cmdLine = cmds[i].split(' ');
	results.push(cmdLine);
    }
    return (results);
}

rl.on('line', function(line) {
    var lineStrimed = utils.trim(line);
    var cmds = getCmd(lineStrimed);
    for (cmd in cmds) {
	var baseCmd = cmds[cmd] ? utils.trim(cmds[cmd][0]) : null;
	if (baseCmd && execCmd[baseCmd]) {
	    execCmd[baseCmd](elsClient, cmds[cmd], function() {
		rl.prompt();
	    });
	} else if (baseCmd && baseCmd != '') {
	    console.log('unknow command', baseCmd);
	}
    }
    rl.prompt();
});

rl.on('close', function() {
    console.log('Bye bye !');
    rl.close();
    process.kill();
});