"use strict";
var fs = require("fs");
var content_type = require('./content_type');

class storage {

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
            var options = content_type.is_imgdata(type) ? 'binary' : {
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
