var fs = require('fs');
var path = require('path');
var content_type = require('./content_type');
var parse = require('./parse');
var logger = require('./logger');

var route = module.exports = {
    dispatch: function(request, body) {
        return new Promise(function(resolve, reject) {
            logger.debug('begin dispatch ......');
            parse.exec(request, body)
                .then(route.fetch)
                .then(resolve)
                .catch(reject);
        });
    },
    fetch: function(_request) {
            logger.debug('controller:' + _request.controller);
            logger.debug('action:' + _request.action);
            logger.debug('extend:' + _request.extend);
            logger.debug('begin fetch ......');
        return new Promise(function(resolve, reject) {
            try {
                if (content_type.is_static(_request.extend)) {
                    route.assets(_request).then(resolve).catch(reject);
                } else {
                    route.mvc(_request).then(resolve).catch(reject);
                }
            } catch (err) {
                reject(err);
            }
        });
    },
    assets:function(_request){
        return new Promise(function(resolve, reject) {
            var response = require('./response');
            var assets_path = path.resolve('./assets' + _request.path);
            logger.debug('assets_path:' + assets_path);
            if (fs.existsSync(assets_path)) {
                response.assets(assets_path, _request.extend).then(resolve).catch(reject);
            } else {
                resolve(null);
            }
        });
    },
    mvc:function(_request){
        return new Promise(function(resolve, reject) {
            var controller_path = path.resolve('./controller/' + _request.controller + '.js');
            logger.debug('controller_path:' + controller_path);
            if (fs.existsSync(controller_path)) {
                var mod = require('../controller/' + _request.controller);
                var controller = new mod(_request);
                if (controller[_request.action]) {
                    controller[_request.action]().then(resolve).catch(reject);
                } else {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    }
}
