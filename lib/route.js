var logger = require('./logger');
var app = require('../conf/application');
var fs = require('fs');
var path = require('path');
var content_type = require('./content_type');
var parse = require('./parse');

var route = module.exports = {
    not_found_body: {
        'code': 404,
        'type': '',
        'body': ''
    },
    dispatch: function(request, body) {
        return new Promise(function(resolve, reject) {
            parse.exec(request, body)
                .then(route.fetch)
                .then(resolve)
                .catch(reject);
        });
    },
    fetch: function(_request) {
        if (app['debug']) {
            logger.info('begin action ......');
            logger.info('controller:' + _request.controller);
            logger.info('action:' + _request.action);
            logger.info('extend:' + _request.extend);
        }
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
            var mod = require('./response');
            var assets_path = path.resolve('./assets' + _request.path);
            if (app['debug']) {
                logger.info('assets_path:' + assets_path);
            }
            if (fs.existsSync(assets_path)) {
                var response = new mod(_request);
                response.assets(assets_path, _request.extend).then(resolve).catch(reject);
            } else {
                resolve(route.not_found_body);
            }
        });
    },
    mvc:function(_request){
        return new Promise(function(resolve, reject) {
            var controller_path = path.resolve('./controller/' + _request.controller + '.js');
            if (app['debug']) {
                logger.info('controller_path:' + controller_path);
            }
            if (fs.existsSync(controller_path)) {
                var mod = require('../controller/' + _request.controller);
                var controller = new mod(_request);
                if (controller[_request.action]) {
                    controller[_request.action]().then(resolve).catch(reject);
                } else {
                    resolve(route.not_found_body);
                }
            } else {
                resolve(route.not_found_body);
            }
        });
    }
}
