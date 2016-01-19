"use strict";
var MysqlClient = require('mysql');
var Pool = require('../tool/pool');

class mysql {

    static get_pool(config){
        if(!mysql.pool){
            mysql.pool = new Pool('mysql',function(){
                return this.get_db(config);
            }.bind(this),function(db){
                db.end();
            })
        }
        return mysql.pool;
    }

    static get_db(config){
        return new Promise(
            function(resolve, reject){
                try{
                    var conf_mysql= require(config['mysql_configuration']);
                    var environment = config['environment'];
                    var db_config = conf_mysql[environment];
                    var db = MysqlClient.createPool(db_config);
                    resolve(db);
                }
                catch(err){
                    reject(err);
                }
            }.bind(this)
        );
    }

}

mysql.pool = null;

module.exports = mysql;