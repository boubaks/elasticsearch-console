#!/usr/bin/env node
var utils = require(__dirname + '/../lib/utils');
var logger = require(__dirname + '/../lib/logger');
var getopt = require('node-getopt');
var readline = require('readline');
var exec = require(__dirname + '/execution');
var elsClient = require('elasticsearch-client');

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

new elsClient(host, port, function (client, msg) {
    if (!client) {
        throw('Couldn\'t connect to ELS');
    }
    var scope = this;
    elsClient = client;
    rl.prompt();
});

var showHelp = function() {
    console.log(' ------------------------------------------------------');
    console.log('| ELASTICSEARCH-CONSOLE                     by boubaks |');
    console.log(' ------------------------------------------------------');
    console.log('');
    console.log('exit :          to exit the elastic console');
    console.log('');
    console.log('ping :          show if the console is connected to ELS');
    console.log('');
    console.log('show :          show informations about ELS (indexes, clusters infos, ...)');
    console.log('--------------------------------------------------------');
    console.log('find :          find the data that you want');
    console.log('                params : --type, --query, --index, --options');
    console.log('--------------------------------------------------------');
    console.log('remove :        remove the data that you want');
    console.log('                params : --type, --query, --index');
    console.log('--------------------------------------------------------');
    console.log('update :        update the data that you want');
    console.log('                params : --type, --query, --index, --object');
    console.log('--------------------------------------------------------');
    console.log('insert :        find the data that you want');
    console.log('                params : --type, --index, --object');
    console.log('--------------------------------------------------------');
    console.log('');
};

var execCmd = {
    // ELS server infos
    'exit': exec.exit,
    'ping': exec.handlePing,
    'show': exec.showInfo,

    // ELS db actions
    'find': exec.handleFind,
    'remove': exec.handleRemove,
    'update': exec.handleUpdate,
    'insert': exec.handleInsert,

    // HELP
    'help': showHelp
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
    if (process.pid) {
        process.kill(process.pid);
    } else {
        console.log('Error: invalid pid... try again');
    }

});