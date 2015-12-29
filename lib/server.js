"use strict";
var http = require('http');

class server {

    constructor(config) {
        this.config = config;
        var logger = require('./logger');
        this.logger = new logger(config);
        this.route = require('./route');
        this.route.config = this.config;
        this.route.logger = this.logger;
    }

    init(executor) {
        this.instance = http.createServer(function(request, response) {
            response.setTimeout(60000, function() {
                server.error_handler(504, response);
            });
            executor.call(this, request, response);
        }.bind(this));
    }

    run() {
        this.init(this.normal);
        this.logger.debug('begin server on ' + this.config.port + ' ......');
        this.instance.listen(this.config.port);
    }

    restful() {
        this.init(this.rest);
        this.logger.debug('begin restful server on ' + this.config.port + ' ......');
        this.instance.listen(this.config.port);
    }

    normal(request, response) {
        this.route.dispatch(request).then(function(_response) {
                console.log(_response);
                if (_response) {
                    response.writeHead(_response.code, server.header(_response));
                    response.write(_response.body);
                    response.end();
                } else {
                    server.error_handler(404, response);
                }
                return false;
            }).catch(function(err) {
                this.logger.debug('route_err:' + err);
                if(this.config.debug){
                    response.writeHead(500, {
                      'Content-Length': err.length,
                      'Content-Type': 'text/plain' 
                    });
                    response.write(err);
                    response.end();
                }else {
                    server.error_handler(500, response);
                }
            }.bind(this));
    }

    rest(request, response) {
        this.route.restful(request)
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
