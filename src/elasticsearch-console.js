var logger = require(__dirname + '/../lib/logger');
var getopt = require('node-getopt');
var readline = require('readline');
var ELSCLIENT = require(__dirname + '/../lib/ElsClient').ElsClient;
var ELSQUERY = require(__dirname + '/../lib/ElsQuery').ElsQuery;

/*
** V1 elasticsearch-console
**
** show indexes;
** db.index.find(query, type, options);
** db.index.insert(query, type, options);
** db.index.remove(query, type, options);
** db.index.update(id, query, options);
** db.index.count(query, type);
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


var handleDB = function(elsClient, cmd, callback) {
    logger.info('handleDB');
    callback();
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
    'db': handleDB,
    'ping': handlePing
};

function getCmd(line) {
    var results = [];
    var cmds = line.split(';');

    for (i in cmds) {
	results[i] = [];
	cmdLine = cmds[i].split(' ');
	for (j in cmdLine) {
	    cmd = cmdLine[j].split('.');
	    for (k in cmd) {
		if (cmd[k])
		    results[i].push(cmd[k]);
	    }
	}
    }
    return (results);
}

rl.on('line', function(line) {
    var cmds = getCmd(line);
    for (cmd in cmds) {
	var baseCmd = cmds[cmd] ? cmds[cmd][0] : null;
	if (baseCmd && execCmd[baseCmd]) {
	    execCmd[baseCmd](elsClient, cmds[cmd], function() {
		rl.prompt();
	    });
	} else if (baseCmd) {
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