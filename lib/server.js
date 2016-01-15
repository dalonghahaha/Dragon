"use strict";
var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');
var parse = require('./parse');
var dragon = require('./dragon');
var content_type = require('./content_type');
var logger = require('./tool/log');
var Mongo = require('./db/mongodb');

const route_set = new Set(['default', 'query','restful']);

class server {

    constructor(config) {
        this.config = config;  
        this.logger = new logger(config);
        
    }

    set router(name){   
        this.route_name = name;
    }

    init() {
        if(!this.route_name){
            this.route_name = "default";
        }
        if(!route_set.has(this.route_name)){
            throw Error('route setting error');
        }
        this.instance = http.createServer(function(request, response) {
            response.setTimeout(30000, function() {
                this.error_handler(504, response, new Error('timeout error'));
            }.bind(this));
            var url_info = url.parse(request.url);
            var path = url_info.pathname;
            var extend = path.lastIndexOf(".") > 0 ? path.substr(path.lastIndexOf(".") + 1) : null;
            if(extend && content_type.is_static(extend)){
                this.assets(path, extend, response);
            } else {
                this.worker(request, response);
            }
        }.bind(this));
    }

    run() {
        this.init();
        this.logger.debug('begin server on ' + this.config.port + ' ......');
        this.instance.listen(this.config.port);
    }

    assets(assets_path, extend, response){
        var assets_path = path.join(this.config['assets_root'], assets_path);
        //this.logger.debug('assets:' + assets_path);
        if (!fs.existsSync(assets_path)) {
            this.error_handler(404, response);
            return false;
        }
        var _dragon = new dragon();
        _dragon.assets(assets_path, extend).then(function(resolve){
            this.normal_handler(resolve,response);
        }.bind(this)).catch(function(err) {
            if(this.config.debug){
                this.error_debug(err,response);
            }else {
                this.error_handler(500,response);
            }
            return false;
        }.bind(this));
    }

    worker(request, response){
        //路由
        var route = require(path.join(__dirname,"route",this.route_name));
        var destiny = new route().dispatch(request);
        if(!destiny){
            return this.error_handler(500, response, new Error('route error'));
        }
        //this.logger.debug('controller:' + destiny.controller);
        //this.logger.debug('action:' + destiny.action);
        //初始化controller
        var controller_path = path.join(this.config['controller_root'], destiny.controller + '.js');
        //this.logger.debug('controller_path:' + controller_path);
        if (!fs.existsSync(controller_path)) {
            return this.error_handler(404, response, new Error('controller no found'));
        }      
        var controller = require(path.join(this.config['controller_root'], destiny.controller));

        if (!controller[destiny.action]) {
            return this.error_handler(404, response, new Error('action no found'));
        }
        //执行
        this.init_dragon(destiny,request).then(function(_dragon){
            var result = controller[destiny.action](_dragon);
            if (result instanceof Promise){
                result.then(function(resolve){
                    return this.normal_handler(resolve,response);
                }.bind(this)).catch(function(err){
                    return this.error_handler(500,response,err);
                }.bind(this));
            } else {
                return this.normal_handler(result,response);
            }
        }.bind(this)).catch(function(err){
            return this.error_handler(500,response,err);
        }.bind(this));
    }

    init_dragon(destiny,request){
        return new Promise(function(resolve, reject) {
            var parser = new parse(request);
            parser.exec().then(function(params){
                var _dragon = new dragon(request,destiny,params,this.config);
                resolve(_dragon);
            }.bind(this)).catch(reject);
        }.bind(this));
    }

    header(_response) {
        if (_response) {
            //重定向特殊处理
            if (_response.type == 'redirect') {
                return {
                    'Location': _response.body,
                    'connection':'keep-alive'
                };
            }
            var buffer = new Buffer(_response.body);
            if (_response.cookie && _response.cookie.length) {
                return {
                    'Content-Type': _response.type,
                    'Content-Length': buffer.length,
                    'Set-Cookie': _response.cookie,
                    'connection':'keep-alive'
                };
            } else {
                return {
                    'Content-Type': _response.type,
                    'Content-Length': buffer.length,
                    'connection':'keep-alive'
                };
            }
        } else {
            return {
                'Content-Length': 0,
                'connection':'keep-alive'
            }
        }
    }

    normal_handler(_response,response){
        response.writeHead(_response.code, this.header(_response));
        response.write(_response.body);
        response.end();
    }

    error_handler(code, response, err){
        this.logger.error('server error code ' + code + ' message:' + err.message);
        if(err && this.config.debug){
            this.error_debug(code,response,err);
            return;
        }
        switch (code) {
            case 404:
                if(err && this.config.debug){
                    this.error_debug(err,response);
                }
                response.writeHead(404, this.header(null));
                break;
            case 500:
                response.writeHead(500, this.header(null));
                break;
            case 504:
                response.writeHead(504, this.header(null));
                break;
            default:
        }
        response.end();
    }

    error_debug(code, response, err){
        this.logger.error('server error code ' + code + ' message:' + err.message);
        response.writeHead(code, {
          'Content-Type': 'text/plain' 
        });
        if(err instanceof Error){
            response.write(err.stack);
        } else { 
            response.write(err);
        }
        response.end();
    }
}

module.exports = server;
