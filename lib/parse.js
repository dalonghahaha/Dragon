"use strict";
var url = require('url');
var querystring = require('querystring');
var formidable = require('formidable');

class parse {

    constructor(request) {
        this.request = request;
    }

    parse_get(){
        var url_info = url.parse(this.request.url);
        var query = url_info.query;
        if (!query) {
            return {};
        } else {
            var _get = {};
            var query_array = query.split('&');
            for (var p in query_array) {
                var get_info = query_array[p].split('=');
                _get[get_info[0]] = querystring.unescape(get_info[1]);
            }
            return _get;
        }
    }

    parse_post(){
        return new Promise(
            function(resolve, reject) {
                var form = new formidable.IncomingForm();
                form.parse(this.request, function(err, fields, files) {
                    if (err) {
                        reject(err);
                    }
                    resolve({
                        'post' : fields,
                        'file' : files
                    });
                });
            }.bind(this)
        );
    }

    parse_cookie(){
        var headers = this.request.headers
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

    exec(){
        return new Promise(function(resolve, reject) {
            this.parse_post().then(function(params){
                params.get = this.parse_get();
                params.cookie = this.parse_cookie();
                resolve(params);
            }.bind(this)).catch(reject);;
        }.bind(this));
    }
}

module.exports = parse;