var fs = require('fs');
var path = require('path');
var application = require('../conf/application');
var content_type = require('./content_type');
var parse = require('./parse');
var logger = require('./logger');
var dargon = require('./dargon');

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
    assets: function(_request) {
        return new Promise(function(resolve, reject) {
            var assets_path = path.resolve('./' + application['assets_root'] + '/' + _request.path);
            logger.debug('assets_path:' + assets_path);
            if (fs.existsSync(assets_path)) {
                new dargon(_request).assets(assets_path, _request.extend).then(resolve).catch(reject);
            } else {
                resolve(null);
            }
        });
    },
    mvc: function(_request) {
        return new Promise(function(resolve, reject) {
            var controller_path = path.resolve('./' + application['assets_controller'] + '/' + _request.controller + '.js');
            logger.debug('controller_path:' + controller_path);
            if (fs.existsSync(controller_path)) {
                var controller = require('../' + application['assets_controller'] + '/' + _request.controller);
                if (controller[_request.action]) {
                    var _dargon = new dargon(_request);
                    var result = controller[_request.action](_dargon);
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
