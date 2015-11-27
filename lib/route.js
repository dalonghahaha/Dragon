var fs = require('fs');
var path = require('path');
var content_type = require('./content_type');
var parse = require('./parse');
var dragon = require('./dragon');

var route = module.exports = {
    dispatch: function(request) {
        return new Promise(function(resolve, reject) {
            this.logger.debug('begin dispatch ......');
            parse.exec(request)
                .then(this.fetch.bind(this))
                .then(resolve)
                .catch(reject);
        }.bind(this));
    },
    restful:function(request){
        return new Promise(function(resolve, reject) {
            this.logger.debug('begin dispatch ......');
            parse.restful(request)
                .then(this.fetch)
                .then(resolve)
                .catch(reject);
        }.bind(this));
    },
    fetch: function(_request) {
        this.logger.debug('controller:' + _request.controller);
        this.logger.debug('action:' + _request.action);
        this.logger.debug('extend:' + _request.extend);
        this.logger.debug('begin fetch ......');
        return new Promise(function(resolve, reject) {
            try {
                if (content_type.is_static(_request.extend)) {
                    this.assets(_request).then(resolve).catch(reject);
                } else {
                    this.mvc(_request).then(resolve).catch(reject);
                }
            } catch (err) {
                reject(err);
            }
        }.bind(this));
    },
    assets: function(_request) {
        return new Promise(function(resolve, reject) {
            var assets_path = path.join(route.config['assets_root'], _request.path);
            this.logger.debug('assets_path:' + assets_path);
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
            this.logger.debug('controller_path:' + controller_path);
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
        }.bind(this));
    }
}
