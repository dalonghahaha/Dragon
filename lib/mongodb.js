"use strict";
var mongoose = require('mongoose');
var logger = require('./logger');
var app = require('../conf/application');
var conf = require('../conf/mongodb');

class mongodb {

    constructor(model) {
        this.model = model;
        logger.trace('model:' + model.modelName);
    }

    static get_conf(environment,conf){
        var conf_info = "mongodb://";
        conf_info += conf[environment]['user'];
        conf_info += ":" + conf[environment]['password'];
        conf_info += "@" + conf[environment]['host'];
        conf_info += ":" + conf[environment]['port'];
        conf_info += "/" + conf[environment]['database'];
        return conf_info;
    }

    static get_connection() {
        var connection = conf.get_conf(app['environment'],conf);
        logger.trace('mongo_connection:' + connection);
        return connection;
    }

    static get_db() {
        return new Promise(function(resolve, reject) {
            mongoose.connect(mongodb.get_connection());
            var db = mongoose.connection;
            db.on('error', function(err) {
                logger.trace('mongodb_connection_error:' + err.message);
                reject(err);
            });
            resolve(db);
        });
    }

    insert(params) {
        var entity = new this.model(params);
        return new Promise(function(resolve, reject) {
            mongodb.get_db().then(function(db) {
                entity.save(function(err, data) {
                    if (err) {
                        logger.trace('mongodb_insert_error:' + err.message);
                        reject(err);
                    } else {
                        resolve(data);
                        db.close();
                    }
                });
            }).catch(reject);
        });
    }

    update(id, params) {
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            mongodb.get_db().then(function(db) {
                entity.findByIdAndUpdate(id, params, function(err, data) {
                    if (err) {
                        logger.trace('mongodb_update_error:' + err.message);
                        reject(err);
                    } else {
                        resolve(data);
                        db.close();
                    }
                });
            }).catch(reject);
        });
    }

    delete(id) {
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            mongodb.get_db().then(function(db) {
                entity.findByIdAndRemove(id, function(err, data) {
                    if (err) {
                        logger.trace('mongodb_delete_error:' + err.message);
                        reject(err);
                    } else {
                        resolve(data);
                        db.close();
                    }
                });
            }).catch(reject);
        });
    }

    find(search) {
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            mongodb.get_db().then(function(db) {
                entity.find(search, function(err, data) {
                    if (err) {
                        logger.trace('mongodb_find_error:' + err.message);
                        reject(err);
                    } else {
                        resolve(data);
                        db.close();
                    }
                });
            }).catch(reject);
        });
    }

    query(query_params) {
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            mongodb.get_db().then(function(db) {
                var query = entity.find(query_params.search);
                if (query_params.skip) {
                    query.skip(query_params.skip);
                }
                if (query_params.limit) {
                    query.limit(query_params.limit);
                }
                query.exec(function(err, data) {
                    if (err) {
                        logger.trace('mongodb_query_error:' + err.message);
                        reject(err);
                    } else {
                        resolve(data);
                        db.close();
                    }
                });
            }).catch(reject);
        });
    }

    findOne() {
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            mongodb.get_db().then(function(db) {
                entity.findOne(function(err, data) {
                    if (err) {
                        logger.trace('mongodb_findOne_error:' + err.message);
                        reject(err);
                    } else {
                        resolve(data);
                        db.close();
                    }
                });
            }).catch(reject);
        });
    }

    count() {
        var entity = this.model;
        return new Promise(function(resolve, reject) {
            mongodb.get_db().then(function(db) {
                entity.count(function(err, data) {
                    if (err) {
                        logger.trace('mongodb_count_error:' + err.message);
                        reject(err);
                    } else {
                        resolve(data);
                        db.close();
                    }
                });
            }).catch(reject);
        });
    }
}

module.exports = mongodb;
