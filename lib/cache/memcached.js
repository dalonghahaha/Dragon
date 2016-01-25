"use strict";
var MemcachedClient = require('memcached');
var Pool = require('../tool/pool');

class memcached {

    static get_pool(config){
        if(!memcached.pool){
            memcached.pool = new Pool('memcached',function(){
                return this.get_client(config);
            }.bind(this),function(db){
                return new Promise(
                    function(resolve, reject){
                        try{
                            db.end();
                        } catch(err){
                            reject(err);
                        }
                        resolve(true);
                    }.bind(this)
                );
            })
        }
        return memcached.pool;
    }

    static get_client(config){
        return new Promise(
            function(resolve, reject){
                try{
                    var conf_mysql= require(config['memcached_configuration']);
                    var environment = config['environment'];
                    var cache_config = conf_mysql[environment];
                    var server_config = cache_config['host'] + ":" + cache_config['port'];
                    var client = new MemcachedClient(server_config,{
                        'poolSize' : 10
                    });
                    resolve(client);
                } catch(err){
                    reject(err);
                }
            }.bind(this)
        );
    }

}

memcached.pool = null;

module.exports = memcached;