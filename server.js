var http=require('http');
var route=require('./route');

function server (port) {
	if(arguments[0]){
		this.port=arguments[0];
	}
}

server.prototype.port = 80;

server.prototype.run=function(){
	console.log('begin server ......');
	http.createServer(function (request, response) {
	    route.dispatcher(request).then(function(data){
	    	response.writeHead(200, { 'Content-Type': 'text/plain'});
			response.write('hello Dragon :' + data);
			response.end();
	    }).catch(function(err){
	    	console.error(err);
	    	response.writeHead(500);
			response.end();
	    });
	}).listen(this.port);
}

module.exports = server;