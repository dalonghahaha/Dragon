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
        return new Promise(function(resolve, reject) {
            mongoose.connect(mongodb.get_connection());
            var db = mongoose.connection;
            db.on('error', function(err) {
                reject(err);
            });
            resolve(db);
        });
    }

    insert(params){
        var entity = new this.model(params);
        var db = this.get_db();
        return new Promise(function(resolve, reject) {
            db.on('error', function(err) {
                reject(err);
            });
            entity.save(function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                    db.close();
                }
            });
        });
    }

    update(id, params){
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            entity.findByIdAndUpdate(id, params, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                    db.close();
                }
            });
        });
    }

    delete(id){
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            entity.findByIdAndRemove(id, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                    db.close();
                }
            });
        });
    }

    find(search) {
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            mongodb.get_db().then(function(db){
                entity.find(search, function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                        db.close();
                    }
                });
            }).catch(reject);
        });
    }

    query(query_params){
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            var db = mongodb.get_db();
            db.on('error', function(err) {
                reject(err);
            });
            var query = entity.find(query_params.search);
            if(query_params.skip){
                query.skip(query_params.skip);
            }
            if(query_params.limit){
                query.limit(query_params.limit);
            }
            query.exec(function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                    db.close();
                }
            });
        });
    }

    findOne(){
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            var db = mongodb.get_db();
            db.on('error', function(err) {
                reject(err);
            });
            entity.findOne(function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                    db.close();
                }
            });
        });
    }

    count(){
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            var db = mongodb.get_db();
            db.on('error', function(err) {
                reject(err);
            });
            entity.count(function(err, data) {
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
