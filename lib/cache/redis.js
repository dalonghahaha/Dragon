"use strict";
var RedisClient = require('redis');
var Pool = require('../tool/pool');

class redis {

    static get_pool(config){
        if(!redis.pool){
            redis.pool = new Pool('redis',function(){
                return this.get_client(config);
            }.bind(this),function(client){
                return new Promise(
                    function(resolve, reject){
                        try{
                            client.end();
                        } catch(err){
                            reject(err);
                        }
                        resolve(true);
                    }.bind(this)
                );
            })
        }
        return redis.pool;
    }

    static get_client(config){
        return new Promise(
            function(resolve, reject){
                try{
                    var conf_redis= require(config['redis_configuration']);
                    var environment = config['environment'];
                    var cache_config = conf_redis[environment];
                    var client = RedisClient.createClient(cache_config['port'],cache_config['host'],{});
                    resolve(client);
                } catch(err){
                    reject(err);
                }
            }.bind(this)
        );
    }

}

redis.pool = null;

module.exports = redis;