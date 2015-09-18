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
    }
    dispatch: function(request, body) {
        return new Promise(function(resolve, reject) {
            route.parse(request, body)
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
                    var mod = require('./response');
                    var assets_path = path.resolve('./assets' + _request.path);
                    if (app['debug']) {
                        logger.info('assets_path:' + assets_path);
                    }
                    fs.exists(assets_path, function(exists) {
                        if (exists) {
                            var response = new mod(_request);
                            resolve(response.assets(assets_path, _request.extend));
                        } else {
                            resolve(route.not_found_body);
                        }
                    });
                } else {
                    var controller_path = path.resolve('./controller/' + _request.controller + '.js');
                    if (app['debug']) {
                        logger.info('path:' + controller_path);
                    }
                    fs.exists(controller_path, function(exists) {
                        if (exists) {
                            var mod = require('../controller/' + _request.controller);
                            var controller = new mod(_request);
                            if (controller[_request.action]) {
                                resolve(controller[_request.action]());
                            } else {
                                resolve(route.not_found_body);
                            }
                        } else {
                            resolve(route.not_found_body);
                        }
                    });
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}
