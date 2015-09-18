var http=require('http');
var logger=require('./lib/logger');
var route=require('./lib/route');
var app=require('./conf/application');

function server (port) {
	if(arguments[0]){
		this.port=arguments[0];
	}
}

server.prototype.port = 80;

server.prototype.run=function(){
	if(app['debug']){
		logger.info('begin server ......');
	}
	http.createServer(function (request, response) {

		var body = [];

		request.on('data', function (chunk) {
	        body.push(chunk);
	    });

	    request.on('end', function () {
	        body = Buffer.concat(body);
			route.dispatch(request).then(function(_response){
				var message={
					'Content-Length': _response.body.length,
  					'Content-Type': _response.type
				}
		    	response.writeHead(_response.code,message);
				response.write(_response.body);
				response.end();
		    }).catch(function(err){
		    	logger.error(err);
		    	response.writeHead(500);
				response.end();
		    });
	    });

	}).listen(this.port);
}

module.exports = server;