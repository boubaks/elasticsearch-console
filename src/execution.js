var logger = require(__dirname + '/../lib/logger');
var getopt = require('node-getopt');

var opt = getopt.create([
    ['', 'query=ARG', 'query test'],
    ['', 'type=ARG', 'type test'],
    ['', 'options=ARG','options test']
])
    .error(function(err) {
	console.log(err);
    });


function getParams(cmd) {
    console.log('getParams', cmd);
    opt.parse(cmd);
    console.log('opt', opt.parsedOption);
}

exports.handleFind = function(elsClient, cmd, callback) {
    logger.info('handleFind');
    getParams(cmd);
    /*
    elsQuery.generate(type, query, null, {term: true}, function(err, queryELS) {
    if (err)
	callback(err, queryELS);
	elsQuery.deleteHandle(0, true);
	elsClient.search(index, queryELS, null, function(err, res) {
	    callback();
	});
    });
    */
};

exports.handleRemove = function(elsClient, cmd, callback) {
    logger.info('handleRemove');
    getParams(cmd);
};

exports.handleUpdate = function(elsClient, cmd, callback) {
    logger.info('handleUpdate');
    getParams(cmd);
};

exports.handleInsert = function(elsClient, cmd, callback) {
    logger.info('handleInsert');
    getParams(cmd);
};

exports.handlePing = function(elsClient, cmd, callback) {
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
