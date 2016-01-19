"use strict";
var MongoClient = require('mongodb').MongoClient;
var Pool = require('../tool/pool');

class mongodb  {

    static url(config) {
        if(!config['mongodb_configuration']){
            throw new Error('mongodb config no found');
        }
        var conf_mongodb = require(config['mongodb_configuration']);
        var environment = config['environment'];
        if(!environment){
            throw new Error('environment no found');
        }
        if(!conf_mongodb[environment]){
            throw new Error('mongodb config environment no found');
        }
        var connection = "mongodb://";
        if(conf_mongodb[environment]['user'].length > 0){
            connection += conf_mongodb[environment]['user'] + ":";
        }
        if(conf_mongodb[environment]['password'].length > 0){
            connection += conf_mongodb[environment]['password'] + "@";
        }
        connection += conf_mongodb[environment]['host'];
        connection += ":" + conf_mongodb[environment]['port'];
        connection += "/" + conf_mongodb[environment]['database'];
        return connection;
    }

    static get_pool(config){
        if(!mongodb.pool){
            mongodb.pool = new Pool('mongodb',function(){
                return this.get_db(config);
            }.bind(this),function(db){
                return db.close(true);
            })
        }
        return mongodb.pool;
    }

    static get_db(config){
        return new Promise(function(resolve, reject) {
            MongoClient.connect(mongodb.url(config),{
                server:{
                    poolSize:10
                }
            },function(err, db) {
                if(err){
                    reject(err);
                } else {
                    resolve(db);
                }
            });
        });
    }
}

mongodb.pool = null;

module.exports = mongodb;