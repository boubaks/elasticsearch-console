var utils = require(__dirname + '/../lib/utils');
var logger = require(__dirname + '/../lib/logger');
var getopt = require('node-getopt');
var readline = require('readline');
var exec = require(__dirname + '/execution');
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


var execCmd = {
    // ELS server infos
    'ping': exec.handlePing,

    // ELS db actions
    'find': exec.handleFind,
    'remove': exec.handleRemove,
    'update': exec.handleUpdate,
    'insert': exec.handleInsert
};

function getCmd(line) {
    var results = [];
    var cmds = line.split(';');

    for (i in cmds) {
	var cmdLine = utils.trimToTab(cmds[i]);
	results.push(cmdLine);
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