"use strict";
var url = require('url');
var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
var logger = require('./tool/log');
var storage = require('./tool/storage');
var cookie = require('./cookie');
var content_type = require('./content_type');

class dargon {

    constructor(request,destiny,params,config) {
        if(request){
            this._request = {};
            this._request.method = request.method;
            this._request.httpVersion = request.httpVersion;
            this._request.headers = request.headers;
            var url_info = url.parse(request.url);
            this._request.search = url_info.search;
            this._request.query = url_info.query;
            this._request.path = url_info.pathname;
        }
        this.destiny = destiny;
        this.params = params;
        this.config = config;
        this.cookie = new cookie(params.cookie);
        this.logger = new logger(config)
    }

    redirect(url){
        return {
            'code': 302,
            'type': 'redirect',
            'cookie': this.cookie.join(),
            'body': url
        };
    }

    json(data) {
        return {
            'code': 200,
            'type': content_type['json'],
            'cookie': this.cookie.join(),
            'body': JSON.stringify(data)
        };
    }

    default_path() {
        var view_path = this.config['views_root'] + '/' + this.destiny.controller + "/" + this.destiny.action + '.' + this.config['tpl_ext'];
        return view_path;
    }

    render(data,tpl_path) {
        var view_path = tpl_path ? this.config['views_root'] + '/'+ tpl_path + '.' + this.config['tpl_ext'] : this.default_path();
        var src = fs.readFileSync(view_path, {
            encoding: 'utf-8'
        });
        return {
            'code': 200,
            'type': content_type['html'],
            'cookie': this.cookie.join(),
            'body': ejs.render(src, data)
        };
    }

    custom(code,type,body){
        return {
            'code': code,
            'type': type,
            'cookie': this.cookie_join(),
            'body': body
        };
    }

    echo(info) {
        return {
            'code': 200,
            'type': content_type['html'],
            'cookie': this.cookie.join(),
            'body': info.toString()
        };
    }

    assets(path, type) {
        return new Promise(function(resolve, reject) {
            storage.get_file(path, type).then(function(buffer){
                resolve({
                        'code': 200,
                        'type': content_type[type],
                        'body': buffer
                    });
            }).catch(reject);
        });
    }

    set_cookie(name, value, options) {
        this.cookie.set_cookie(name, value, options);
    }

    remove_cookie(name, path) {
        this.cookie.remove_cookie(name, path);
    }
}

module.exports = dargon;
