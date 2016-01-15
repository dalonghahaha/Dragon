"use strict";
var MongoClient = require('mongodb').MongoClient;
var Pool = require('../tool/pool');

class mongodb  {

    static url(config) {
        var conf_mongodb = require(config['mongodb_configuration']);
        var environment = config['environment'];
        var connection = "mongodb://";
        connection += conf_mongodb[environment]['user'];
        connection += ":" + conf_mongodb[environment]['password'];
        connection += "@" + conf_mongodb[environment]['host'];
        connection += ":" + conf_mongodb[environment]['port'];
        connection += "/" + conf_mongodb[environment]['database'];
        return connection;
    }

    static get_pool(config){
        if(!mongodb.pool){
            mongodb.pool = new Pool('mongodb',function(){
                return this.get_db(config);
            }.bind(this),function(db){
                db.close();
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