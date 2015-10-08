"use strict";
var http = require('http');
var logger = require('./logger');
var route = require('./route');

class server {

    constructor(config) {
        this.config = config;
        this.logger = new logger(config);
    }

    init_server() {
        var _self = this;
        this.instance = http.createServer(function(request, response) {
            response.setTimeout(60000, function() {
                response.writeHead(504, server.header(null));
                response.end();
            });
            _self.exec(request,response);
        });
    }

    init_restful() {
        var _self = this;
        this.instance = http.createServer(function(request, response) {
            response.setTimeout(60000, function() {
                response.writeHead(504, server.header(null));
                response.end();
            });
            _self.exec(request,response);
        });
    }

    init_restful(){
        var _self = this;
        this.instance = http.createServer(function(request, response) {
            response.setTimeout(60000, function() {
                response.writeHead(504, server.header(null));
                response.end();
            });
            _self.rest(request,response);
        });
    }

    run() {
        this.init_server();
        this.logger.debug('begin server on '+ this.config.port +' ......');
        this.instance.listen(this.config.port);
    }

    restful(){
        this.init_restful();
        this.logger.debug('begin restful server on '+ this.config.port +' ......');
        this.instance.listen(this.config.port);
    }

    exec(request,response) {
        var _logger=this.logger;
        var _config=this.config;
        route.dispatch(request,_logger,_config)
            .then(function(_response) {
                if(_response){
                    response.writeHead(_response.code, server.header(_response));
                    response.write(_response.body, _response.options);
                } else {
                    response.writeHead(404, server.header(null));
                }
                response.end();
            }).catch(function(err) {
                _logger.error(err);
                response.writeHead(500, server.header(null));
                response.end();
            });
    }

    rest(request,response) {
        var _logger=this.logger;
        var _config=this.config;
        route.restful(request,_logger,_config)
            .then(function(_response) {
                if(_response){
                    response.writeHead(_response.code, server.header(_response));
                    response.write(_response.body, _response.options);
                } else {
                    response.writeHead(404, server.header(null));
                }
                response.end();
            }).catch(function(err) {
                _logger.error(err);
                response.writeHead(500, server.header(null));
                response.end();
            });
    }

    static header(_response) {
        if(_response) {
            //重定向特殊处理
            if(_response.type == 'redirect'){
                return {
                    'Location': _response.body
                };
            }
            var buffer = new Buffer(_response.body);
            if(_response.cookie && _response.cookie.length){
                return {
                    'Content-Type': _response.type,
                    'Content-Length': buffer.length,
                    'Set-Cookie':_response.cookie
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
}

module.exports = server;
