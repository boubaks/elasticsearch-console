var logger = require(__dirname + '/../lib/logger');
var getopt = require('node-getopt');
var ELSQUERY = require(__dirname + '/../lib/ElsQuery').ElsQuery;
var error = false;

var elsQuery = undefined;
new ELSQUERY(function(tmpQuery) {
    elsQuery = tmpQuery;
});

var opt = getopt.create([
    ['', 'query=ARG', 'query'],
    ['', 'type=ARG', 'type'],
    ['', 'index=ARG', 'index'],
    ['', 'object=ARG', 'object'],
    ['', 'options=ARG','options']
])
    .error(function(err) {
	console.log(err);
	error = true;
    });


function getParams(cmd, callback) {
    console.log('getParams', cmd);

    opt.parse(cmd);
    if (error == true) {
	callback(error, opt.parsedOption);
	error = false;
    } else {
	callback(error, opt.parsedOption);
    }
}

exports.handleFind = function(elsClient, cmd, callback) {
    logger.info('handleFind');
    getParams(cmd, function(err, opt) {
	var type = opt.options.type ? opt.options.type : null;
	var index = opt.options.index ? opt.options.index : '_all';
	var query = opt.options.query ? opt.options.query : {};

	var options = {};
	var size = opt.options.size ? parseInt(opt.options.size) : 10;
	var from = opt.options.from ? parseInt(opt.options.from) : 0;
	options.size = size;
	options.from = from;
	console.log(options);

	if (type && err == false) {
	    try {
		var queryJSON = query.length > 0 ? JSON.parse(query) : query;
		elsQuery.generate(type, queryJSON, null, {term: true}, function(err, queryELS) {
		    if (err)
			callback(err, queryELS);
		    elsQuery.deleteHandle(0, true);
		    console.log('QUERY ==>', JSON.stringify(queryELS));
		    elsClient.search(index, queryELS, options, function(err, res) {
			if (err) {
			    console.log(err);
			} else if (res && res.hits && res.hits.total > 0) {
			    console.log(res.hits.hits);
			} else {
			    console.log(res);
			}
			callback();
		    });
		});
	    } catch (e) {
		console.log('ERROR', e);
		callback();
	    }
	} else {
	    console.log('find required type');
	    callback();
	}
    });
};

exports.handleRemove = function(elsClient, cmd, callback) {
    logger.info('handleRemove');
    getParams(cmd, function(err, opt) {
	var index = opt.options.index ? opt.options.index : '_all';
	var type = opt.options.type ? opt.options.type : null;
	var query = opt.options.query ? opt.options.query : {};
	var id = query._id ? query._id : null;

	if (id && type) {
	    console.log('deleteById', index, type, id);
	    elsClient.delete(index, type, id, function(err, res) {
		if (err) 
		    console.log(err);
		else
		    console.log(res);
		callback();
	    });
	} else if (index && type) {
	    elsQuery.generate(type, query, null, {term: true}, function(err, queryELS) {
		console.log('deleteByQuery', index, type, queryELS);
		elsClient.deleteByQuery(index, type, queryELS, function(err, res) {
		    if (err)
			console.log(err);
		    else
			console.log(res);
		    callback();
		});
	    });
	} else {
	    console.log('remove required --type');
	    callback();
	}
    });
};


exports.handleUpdate = function(elsClient, cmd, callback) {
    logger.info('handleUpdate');
    getParams(cmd, function(err, opt) {
	var index = opt.options.index ? opt.options.index : '_all';
	var type = opt.options.type ? opt.options.type : null;
	var query = opt.options.query ? opt.options.query : {};
	var object = opt.options.object ? opt.options.object : null;
	var id = query._id ? query._id : null;
	delete (query._id);
	
	if (index && id && type && object) {
	    elsClient.put(index, type, id, object, null, function(err, res) {
		if (err)
		    console.log(err);
		else
		    console.log(res);
		callback();
	    });
	} else {
	    console.log('update required --index, --query (_id), --type & --object');
	    callback();
	}
    });
};

exports.handleInsert = function(elsClient, cmd, callback) {
    logger.info('handleInsert');
    getParams(cmd, function(err, opt) {
	var index = opt.options.index ? opt.options.index : null;
	var type = opt.options.type ? opt.options.type : null;
	var object = opt.options.object ? opt.options.object : null;

	if (index && type && object) {
	    elsClient.post(index, type, object, function(err, res) {
		if (err)
		    console.log(err);
		else
		    console.log(res);
		callback();
	    });
	} else {
	    console.log('insert required --index, --type & --object');
	    callback();
	}
    });
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
