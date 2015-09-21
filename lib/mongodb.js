"use strict";
var mongoose = require('mongoose');
var logger = require('./logger');
var conf = require('../conf/mongodb');

class mongodb {

    constructor(model) {
        this.model = model;
        this.connection = conf.get_conf();
    }

    static get_connection(){
        return conf.get_conf();
    }

    static get_db() {
        mongoose.connect(mongodb.get_connection());
        return mongoose.connection;
    }

    find(search) {
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            var db = mongodb.get_db();
            db.on('error', function(err) {
                reject(err);
            });
            entity.find(search, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                    db.close();
                }
            });
        });
    }
}
    
module.exports = mongodb;
