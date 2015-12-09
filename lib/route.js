var fs = require('fs');
var path = require('path');
var content_type = require('./content_type');
var parse = require('./parse');
var dragon = require('./dragon');

var route = module.exports = {
    dispatch: function(request) {
        return new Promise(function(resolve, reject) {
            route.logger.debug('begin dispatch ......');
            parse.exec(request)
                .then(route.fetch)
                .then(resolve)
                .catch(reject);
        });
    },
    restful:function(request){
        return new Promise(function(resolve, reject) {
            route.logger.debug('begin dispatch ......');
            parse.restful(request)
                .then(route.fetch)
                .then(resolve)
                .catch(reject);
        });
    },
    fetch: function(_request) {
        route.logger.debug('controller:' + _request.controller);
        route.logger.debug('action:' + _request.action);
        route.logger.debug('extend:' + _request.extend);
        route.logger.debug('begin fetch ......');
        return new Promise(function(resolve, reject) {
            if (content_type.is_static(_request.extend)) {
                route.assets(_request).then(resolve).catch(reject);
            } else {
                route.mvc(_request).then(resolve).catch(reject);
            }
        });
    },
    assets: function(_request) {
        return new Promise(function(resolve, reject) {
            var assets_path = path.join(route.config['assets_root'], _request.path);
            route.logger.debug('assets_path:' + assets_path);
            if (fs.existsSync(assets_path)) {
                new dragon(_request).assets(assets_path, _request.extend).then(resolve).catch(reject);
            } else {
                resolve(null);
            }
        }.bind(this));
    },
    mvc: function(_request) {
        return new Promise(function(resolve, reject) {
            var controller_path = path.join(route.config['controller_root'], _request.controller + '.js');
            route.logger.debug('controller_path:' + controller_path);
            if (fs.existsSync(controller_path)) {
                var controller = require(path.join(route.config['controller_root'], _request.controller));
                if (controller[_request.action]) {
                    var _dragon = new dragon(_request);
                    var result = controller[_request.action](_dragon);
                    if (result instanceof Promise) {
                        result.then(resolve).catch(reject);
                    } else {
                        resolve(result);
                    }
                } else {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    }
}
