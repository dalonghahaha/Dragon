"use strict";
var path = require('path');
var url = require('url');

class route {

    destiny(request){
        var url_info = url.parse(request.url);
        path = url_info.pathname;
        if (path == "/") {
            return {
                'controller': null,
                'action': null
            }
        } else {
            var path_array = path.split('/');
            return {
                'controller': path_array[1],
                'action': request.method.toLowerCase()
            }
        }
    }

    dispatch(request){
        var url_info = url.parse(request.url);
        return this.destiny(request);
    }
}

module.exports = route;