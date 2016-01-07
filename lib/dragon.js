"use strict";
var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
var logger = require('./logger');
var content_type = require('./content_type');

class dargon {

    constructor(request,config) {
        this.config = config;
        this._request = request;
        this.get = this._request.params.get;
        this.post = this._request.params.post;
        this.file = this._request.params.file;
        this.cookie = this._request.params.cookie;
        this.init_cookie();
    }

    init_cookie() {
        this._setCookieMap = {};
    }

    redirect(url){
        return {
            'code': 302,
            'type': 'redirect',
            'cookie': this.coolie_join(),
            'body': url
        };
    }

    json(data) {
        return {
            'code': 200,
            'type': content_type['json'],
            'cookie': this.coolie_join(),
            'body': JSON.stringify(data)
        };
    }

    get_default_path(request) {
        var view_path = this.config['views_root'] + '/' + this._request.controller + "/" + this._request.action + '.' + this.config['tpl_ext'];
        return view_path;
    }

    render(data, tpl_path) {
        var view_path = tpl_path ? this.config['views_root'] + '/'+ tpl_path + '.' + this.config['tpl_ext'] : this.get_default_path();
        logger.debug("view_path:" + view_path);
        var src = fs.readFileSync(view_path, {
            encoding: 'utf-8'
        });
        return {
            'code': 200,
            'type': content_type['html'],
            'cookie': this.coolie_join(),
            'body': ejs.render(src, data)
        };
    }

    custom(code,type,body){
        return {
            'code': code,
            'type': type,
            'cookie': this.coolie_join(),
            'body': body
        };
    }

    echo(info) {
        return {
            'code': 200,
            'type': content_type['html'],
            'body': info
        };
    }

    assets(path, type) {
        return new Promise(function(resolve, reject) {
            var options = content_type.is_imgdata(type) ? 'binary' : {
                encoding: 'utf-8'
            };
            fs.readFile(path, options, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    var buffer = new Buffer(data, options);
                    resolve({
                        'code': 200,
                        'type': content_type[type],
                        'body': buffer
                    });
                }
            });
        });
    }

    set_cookie(name, value, options) {
        var cookieObj = {
            'key': name,
            'value': value,
            'expires': options && options.expires ? options.expires : 86400,
            'httpOnly': options && options.httpOnly ? options.httpOnly : true,
            'encrypt': options && options.encrypt ? options.encrypt : false,
            'path': options && options.path ? options.path : "/",
            'domain': options && options.domain ? options.domain : false,
            'secure': options && options.secure ? options.secure : false,
        }
        this._setCookieMap[name] = this.cookie_stringify(cookieObj);
    }

    remove_cookie(name, path) {
        var cookieObj = {
            'key': name,
            'value': '',
            'path': path ? path : '/',
            'expires': 0
        }
        this._setCookieMap[name] = this.cookie_stringify(cookieObj);
    }

    cookie_stringify(cookie) {
        var buffer = [cookie.key, "=", cookie.value, ";"];
        var expires_time = (new Date()).getTime() + cookie.expires * 1000;
        var timeObj = new Date(expires_time).toUTCString();
        buffer.push(" expires=", timeObj, ";");
        if (cookie.path) {
            buffer.push(" path=", cookie.path, ";");
        }
        if (cookie.domain) {
            buffer.push(" domain=", cookie.domain, ";");
        }
        if (cookie.secure) {
            buffer.push(" secure=true", ";");
        }
        if (cookie.httpOnly) {
            buffer.push(" httpOnly=true");
        }
        return buffer.join("");
    };

    coolie_join() {
        var returnVal = [];
        for (var key in this._setCookieMap) {
            returnVal.push(this._setCookieMap[key]);
        }
        return returnVal;
    }
}

module.exports = dargon;
