"use strict";
var path = require('path');
var url = require('url');
var querystring = require('querystring');

class route {

    destiny(query){
        var query_array = querystring.parse(query);
        if(query_array['c']){
            return {
                'controller': query_array['c'],
                'action': query_array['a'] ? query_array['a'] : 'index'
            }
        } else {
            return {
                'controller': 'index',
                'action': 'index'
            }
        }
    }

    dispatch(request){
        var url_info = url.parse(request.url);
        return this.destiny(url_info.query);
    }
}

module.exports = route;