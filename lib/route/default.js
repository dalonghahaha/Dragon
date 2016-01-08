"use strict";
var path = require('path');
var url = require('url');

class route {

    destiny(path){
        if (path == "/") {
            return {
                'controller': 'index',
                'action': 'index'
            }
        } else {
            var path_array = path.split('/');
            return {
                'controller': path_array[1],
                'action': path_array[2] ? path_array[2] : 'index'
            }
        }
    }

    dispatch(request){
        var url_info = url.parse(request.url);
        return this.destiny(url_info.pathname);
    }
}

module.exports = route;