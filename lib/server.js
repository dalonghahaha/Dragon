"use strict";
var http = require('http');
var logger = require('./logger');
var route = require('./route');
var app = require('../conf/application');

class server {

    constructor(port) {
        this.port = port;
        this.init();
    }

    init() {
        this.instance = http.createServer(function(request, response) {
            var body = [];

            response.setTimeout(3000, function() {
                logger.info('timeout......');
                response.writeHead(504);
                response.end();
            });

            request.on('data', function(chunk) {
                body.push(chunk);
            });

            request.on('end', function() {
                body = Buffer.concat(body);
                server.exec(request, body, response);
            });
        });
    }

    run() {
        if (app['debug']) {
            logger.info('begin server ......');
        }
        this.instance.listen(this.port);
    }

    static exec(request, body, response) {
        route.dispatch(request, body).then(function(_response) {
            response.writeHead(_response.code, server.header(_response));
            response.write(_response.body, _response.options);
            response.end();
        }).catch(function(err) {
            logger.error(err);
            response.writeHead(500);
            response.end();
        });
    }

    static header(_response) {
        var buffer = new Buffer(_response.body);
        return {
            'Content-Type': _response.type,
            'Content-Length': buffer.length
        }
    }
}

module.exports = server;
