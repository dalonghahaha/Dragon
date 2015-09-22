"use strict";
var http = require('http');
var formidable = require('formidable');
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
            response.setTimeout(60000, function() {
                response.writeHead(504, server.header(null));
                response.end();
            });
            server.exec(request,response);
        });
    }

    run() {
        logger.debug('begin server ......');
        this.instance.listen(this.port);
    }

    static exec(request,response) {
        route.dispatch(request)
            .then(function(_response) {
                if(_response){
                    response.writeHead(_response.code, server.header(_response));
                    response.write(_response.body, _response.options);
                } else {
                    response.writeHead(404, server.header(null));
                }
                response.end();
            }).catch(function(err) {
                logger.error(err);
                response.writeHead(500, server.header(null));
                response.end();
            });
    }

    static header(_response) {
        if(_response) {
            var buffer = new Buffer(_response.body);
            if(_response.cookie && _response.cookie.length){
                return {
                    'Content-Type': _response.type,
                    'Content-Length': buffer.length,
                    'Set-Cookie':_response.cookie
                }
            } else {
                return {
                    'Content-Type': _response.type,
                    'Content-Length': buffer.length
                }
            }
        } else {
            return {
                'Content-Length': 0
            }
        }
    }
}

module.exports = server;
