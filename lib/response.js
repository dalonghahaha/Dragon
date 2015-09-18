"use strict";
var logger = require('./logger');
var fs = require('fs');
var content_type = require('./content_type');

class response {

    constructor(_request) {
        this._request = _request;
    }

    json(data) {
        return {
            'code': 200,
            'type': content_type['json'],
            'body': JSON.stringify(data)
        };
    }

    render(tpl, data) {

    }

    assets(path, type) {
    	var file = fs.readFileSync(path, {encoding: 'utf-8'});
        return {
            'code': 200,
            'type': content_type[type],
            'body': file
        };
    }
}

module.exports = response;
