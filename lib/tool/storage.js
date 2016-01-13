"use strict";
var fs = require("fs");

class storage {

    static imgdata(extend) {
        const static_extend = new Set(['ico', 'png', 'jpg', 'jpe', 'jpeg', 'gif', 'tif', 'tiff']);
        return static_extend.has(extend);
    }

    static save_text_file(data, save_path, name){
        return new Promise(
            function(resolve, reject) {
                if (!fs.existsSync(save_path)) {
                    fs.mkdirSync(save_path);
                }
                fs.writeFile(save_path + name, data, function(err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
            }
        );
    }

    static save_binary_file(data, save_path, name){
        return new Promise(
            function(resolve, reject) {
                if (!fs.existsSync(save_path)) {
                    fs.mkdirSync(save_path);
                }
                fs.writeFile(save_path + name, data, "binary", function(err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
            }
        );
    }

    static get_file(path,type){
        return new Promise(function(resolve, reject) {
            var options = storage.imgdata(type) ? 'binary' : {
                encoding: 'utf-8'
            };
            fs.readFile(path, options, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    var buffer = new Buffer(data, options);
                    resolve(buffer);
                }
            });
        });
    }
}

module.exports = storage;
