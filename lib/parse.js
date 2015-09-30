var url = require('url');
var querystring = require('querystring');
var formidable = require('formidable');

var parse = module.exports = {
    exec: function(request) {
        return new Promise(function(resolve, reject) {
            var form = new formidable.IncomingForm();
            form.parse(request, function(err, fields, files) {
                if (err) {
                    reject(err);
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
                    'cookie':parse.cookie(_request.headers),
                    'get': parse.get(url_info.query),
                    'post': fields,
                    'file': files,
                }
                _request.params = params;
                resolve(_request);
            });
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
                _get[get_info[0]] = querystring.unescape(get_info[1]);
            }
            return _get;
        }
    },
    cookie: function(headers) {
        if (!headers.cookie) {
            return {};
        } else {
            var _cookie = {};
            headers.cookie.split(';').forEach(function(Cookie) {
                var parts = Cookie.split('=');
                _cookie[parts[0].trim()] = (parts[1] || '').trim();
            });
            return _cookie;
        }
    }
}
