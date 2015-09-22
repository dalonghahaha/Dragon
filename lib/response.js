"use strict";
var logger = require('./logger');
var fs = require('fs');
var content_type = require('./content_type');

class response {

    constructor(_request) {
        this._request = _request;
    }

    static json(data) {
        return {
            'code': 200,
            'type': content_type['json'],
            'body': JSON.stringify(data)
        };
    }

    static render(tpl, data) {

    }

    static echo(info) {
        return {
            'code': 200,
            'type': content_type['html'],
            'body': info
        };
    }

    static assets(path, type) {
        return new Promise(function(resolve, reject) {
            var options = content_type.is_imgdata(type) ? 'binary' : { encoding: 'utf-8' };
            fs.readFile(path, options, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    var buffer = new Buffer(data,options); 
                    resolve({
                        'code': 200,
                        'type': content_type[type],
                        'body': buffer
                    });
                }
            });
        });
    }
}

module.exports = response;
