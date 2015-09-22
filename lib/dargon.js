"use strict";
var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
var logger = require('./logger');
var content_type = require('./content_type');
var app = require('../conf/application');

class dargon {

    constructor(request) {
        this._request = request;
        this.get = this._request.params.get;
        this.post = this._request.params.get;
        this.file = this._request.params.file;
        this.cookie = this._request.params.cookie;
        this.init_cookie();
    }

    init_cookie(){
        this._setCookieMap = {};
    }

    json(data) {
        return {
            'code': 200,
            'type': content_type['json'],
            'cookie':this.coolie_join(),
            'body': JSON.stringify(data)
        };
    }

    get_default_path(request) {
        var view_path = path.resolve('./views/' + this._request.controller + "/" + this._request.action + '.' + app['tpl_ext']);
        return view_path;
    }

    render(data, tpl_path) {
        var view_path = tpl_path ? path.resolve('./views/' + tpl_path + '.' + app['tpl_ext']) : this.get_default_path();
        logger.trace("view_path:" + view_path);
        var src = fs.readFileSync(view_path, {
            encoding: 'utf-8'
        });
        return {
            'code': 200,
            'type': content_type['html'],
            'cookie':this.coolie_join(),
            'body': ejs.render(src, data)
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

    set_cookie(cookieObj){
        this._setCookieMap[cookieObj.key] = this.cookie_stringify(cookieObj);
    }

    cookie_stringify(cookie) {
        var buffer = [cookie.key, "=", cookie.value];
        if (cookie.expires) {
            buffer.push(" expires=", (new Date(cookie.expires)).toUTCString(), ";");
        }
        if (cookie.path) {
            buffer.push(" path=", cookie.path, ";");
        }
        if (cookie.domain) {
            buffer.push(" domain=", cookie.domain, ";");
        }
        if (cookie.secure) {
            buffer.push(" secure", ";");
        }
        if (cookie.httpOnly) {
            buffer.push(" httponly");
        }
        return buffer.join("");
    };

    coolie_join(){
        var returnVal = [];
        for(var key in this._setCookieMap) {
             returnVal.push(this._setCookieMap[key]);
        }
        console.log(returnVal.join(", "));
        return returnVal.join(", ");
    }
}

module.exports = dargon;
