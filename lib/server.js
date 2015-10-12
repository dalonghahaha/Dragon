"use strict";
var http = require('http');
var logger = require('./logger');
var route = require('./route');

class server {

    constructor(config) {
        this.config = config;
        this.logger = new logger(config);
    }

    init_server(executor) {
        this.instance = http.createServer(function(request, response) {
            response.setTimeout(60000, function() {
                server.error_handler(504, response);
            });
            executor(request, response, this.logger, this.config);
        }.bind(this));
    }

    run() {
        this.init_server(this.normal);
        this.logger.debug('begin server on ' + this.config.port + ' ......');
        this.instance.listen(this.config.port);
    }

    restful() {
        this.init_restful(this.rest);
        this.logger.debug('begin restful server on ' + this.config.port + ' ......');
        this.instance.listen(this.config.port);
    }

    normal(request, response, logger, config) {
        route.dispatch(request, logger, config)
            .then(function(_response) {
                if (_response) {
                    response.writeHead(_response.code, server.header(_response));
                    response.write(_response.body);
                } else {
                    server.error_handler(404, response);
                }
            }).catch(function(err) {
                logger.error(err);
                server.error_handler(500, response);
            });
    }

    rest(request, response, logger, config) {
        route.restful(request, logger, config)
            .then(function(_response) {
                if (_response) {
                    response.writeHead(_response.code, server.header(_response));
                    response.write(_response.body);
                } else {
                    server.error_handler(404, response);
                }
            }).catch(function(err) {
                logger.error(err);
                server.error_handler(500, response);
            });
    }

    static header(_response) {
        if (_response) {
            //重定向特殊处理
            if (_response.type == 'redirect') {
                return {
                    'Location': _response.body
                };
            }
            var buffer = new Buffer(_response.body);
            if (_response.cookie && _response.cookie.length) {
                return {
                    'Content-Type': _response.type,
                    'Content-Length': buffer.length,
                    'Set-Cookie': _response.cookie
                };
            } else {
                return {
                    'Content-Type': _response.type,
                    'Content-Length': buffer.length
                };
            }
        } else {
            return {
                'Content-Length': 0
            }
        }
    }

    static error_handler(code, response) {
        switch (code) {
            case 404:
                response.writeHead(404, server.header(null));
                break;
            case 500:
                response.writeHead(500, server.header(null));
                break;
            case 504:
                response.writeHead(504, server.header(null));
                break;
            default:
        }
        response.end();
    }
}

module.exports = server;
