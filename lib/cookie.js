"use strict";

class cookie {

  	constructor(cookie) {
  		this._setCookieMap = {};
  		for (var key in cookie) {
            this.set_cookie(key,cookie[key]);
        }
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

    join() {
        var returnVal = [];
        for (var key in this._setCookieMap) {
            returnVal.push(this._setCookieMap[key]);
        }
        return returnVal;
    }
}

module.exports = cookie;