"use strict";
var mongoose = require('mongoose');
var logger = require('./logger');

class mongodb {

    constructor(model,config) {
        this.model = model;
        this.config=config;
        this.logger = new logger(config);
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

    static get_connection(config,logger) {
        var conf_mongodb = require(config['mongodb_configuration']);
        var connection = mongodb.get_conf(config['environment'],conf_mongodb);
        logger.debug('mongo_connection:' + connection);
        return connection;
    }

    static get_db(config,logger) {
        return new Promise(function(resolve, reject) {
            console.log(mongoose.connection);
            // if(!mongoose.connection){
            //     console.log(11111);
            //     mongoose.connect(mongodb.get_connection(config,logger));
            // }
            // var db = mongoose.connection;
            // // db.on('error', function(err) {
            // //     logger.debug('mongodb_connection_error:' + err.message);
            // //     reject(err.message);
            // // });
            // //resolve(db);
        });
    }

    insert(params) {
        var entity = new this.model(params);
        var _config = this.config;
        var _logger = this.logger;
        return new Promise(function(resolve, reject) {
            mongodb.get_db(_config,_logger).then(function(db) {
                entity.save(function(err, data) {
                    if (err) {
                        _logger.debug('mongodb_insert_error:' + err.message);
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
        var _config = this.config;
        var _logger = this.logger;
        return new Promise(function(resolve, reject) {
            mongodb.get_db(_config,_logger).then(function(db) {
                entity.findByIdAndUpdate(id, params, function(err, data) {
                    if (err) {
                        _logger.debug('mongodb_update_error:' + err.message);
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
        var _config = this.config;
        var _logger = this.logger;
        return new Promise(function(resolve, reject) {
            mongodb.get_db(_config,_logger).then(function(db) {
                entity.findByIdAndRemove(id, function(err, data) {
                    if (err) {
                        _logger.debug('mongodb_delete_error:' + err.message);
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
        var _config = this.config;
        var _logger = this.logger;
        return new Promise(function(resolve, reject) {
            mongodb.get_db(_config,_logger).then(function(db) {
                entity.find(search, function(err, data) {
                    db.close();
                    if (err) {
                        _logger.debug('mongodb_find_error:' + err.message);
                        reject(err.message);
                    } else {
                        db.close();
                        resolve(data);
                    }
                });
            }).catch(reject);
        });
    }

    query(query_params) {
        var entity = this.model;
        var _config = this.config;
        var _logger = this.logger;
        return new Promise(function(resolve, reject) {
            mongodb.get_db(_config,_logger).then(function(db) {
                var query = entity.find(query_params.search);
                if (query_params.skip) {
                    query.skip(query_params.skip);
                }
                if (query_params.limit) {
                    query.limit(query_params.limit);
                }
                query.exec(function(err, data) {
                    if (err) {
                        _logger.debug('mongodb_query_error:' + err.message);
                        reject(err.message);
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
        var _config = this.config;
        var _logger = this.logger;
        return new Promise(function(resolve, reject) {
            mongodb.get_db(_config,_logger).then(function(db) {
                entity.findOne(function(err, data) {
                    if (err) {
                        _logger.debug('mongodb_findOne_error:' + err.message);
                        reject(err.message);
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
        var _config = this.config;
        var _logger = this.logger;
        return new Promise(function(resolve, reject) {
            mongodb.get_db(_config,_logger).then(function(db) {
                entity.count(function(err, data) {
                    if (err) {
                        _logger.debug('mongodb_count_error:' + err.message);
                        reject(err.message);
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
