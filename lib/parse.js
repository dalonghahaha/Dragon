"use strict";
var logger = require('./logger');
var url = require('url');
var content_type = require('./content_type');

var parse = module.exports = {
    exec: function(request, body) {
        return new Promise(function(resolve, reject) {
            try {
                if (app['debug']) {
                    logger.info('begin parse request ......');
                }
                var _request = {};
                _request.method = request.method;
                _request.httpVersion = request.httpVersion;
                _request.headers = request.headers;

                var url_info = url.parse(request.url);
                _request.search = url_info.search;
                _request.query = url_info.query;
                _request.path = url_info.pathname;

                var destiny = parse.destiny(url_info.pathname);
                _request.controller = destiny.controller;
                _request.action = destiny.action;
                _request.extend = destiny.extend;

                var params = {
                    'get': parse.get(url_info.query),
                    'post': parse.post(body)
                }
                _request.params = params;

                resolve(_request);
            } catch (err) {
                reject(err);
            }
        });
    },
    destiny: function(path) {
        if (path == "/") {
            return {
                'controller': 'index',
                'action': 'index',
                'extend': null
            }
        } else {
            var path_array = path.split('/');
            logger.info(path.lastIndexOf("."));
            return {
                'controller': path_array[1],
                'action': path_array[2] ? path_array[2] : 'index',
                'extend': path.lastIndexOf(".") > 0 ? path.substr(path.lastIndexOf(".") + 1) : null
            }
        }
    },
    get: function(query) {
        if (!query) {
            return {};
        } else {
            var _get = {};
            var query_array = query.split('&');
            for (p in query_array) {
                var get_info = query_array[p].split('=');
                _get[get_info[0]] = get_info[1];
            }
            return _get;
        }
    },
    post: function(body) {
        return {
            'name': 'douniwan',
            'id': 1
        };
    },
}