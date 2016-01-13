"use strict";
var MongoClient = require('mongodb').MongoClient;
var Pool = require('generic-pool').Pool;

class mongodb  {

    static connection(config) {
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
        if(mongodb.pool != null){
            return mongodb.pool;
        } else {
            mongodb.pool = new Pool({
                name:'mongodb',
                create:function(callback) {
                    mongodb.get_db(config).then(function(db){
                        callback(null, db);
                    }).catch(function(err){
                        callback(err, null);
                    })
                },
                destroy:function(client) { 
                    client.close(); 
                },
                max:1000,
                min:200,
                idleTimeoutMillis:30000,
                log:true
            });
            return mongodb.pool;
        }
    }


    static get_db(config){
        return new Promise(function(resolve, reject) {
            MongoClient.connect(mongodb.connection(config), function(err, db) {
                if(err){
                    reject(err);
                } else {
                    resolve(db);
                }
            });
        });
    }

    static close(db){
        mongodb.pool.destroy(db);
    }
}

mongodb.pool = null

module.exports = mongodb;