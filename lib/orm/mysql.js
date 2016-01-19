"use strict";
var MysqlClient = require('mysql');
var Abstract = require('./abstract');
var Mysql = require('../db/mysql');
var logger = require('../tool/log');

class orm_mysql extends Abstract {

    constructor(table,config){
        super();
        this.table = table;
        this.config = config;
    }

    init_pool(config){
        var conf_mysql= require(config['mysql_configuration']);
        var environment = config['environment'];
        var db_config = conf_mysql[environment];
        this.pool = MysqlClient.createPool(db_config);
    }

    build_select_sql(query_pramas){
        var query_pramas = this.query_pramas;
        var sql = "select ";
        if(this.query_pramas.fields){
            sql += " " + this.query_pramas.fields;
        } else {
            sql += " *";
        }
        sql += " from " + this.table;
        if(this.query_pramas.conditions){
            var where_string=''
            for(var p in this.query_pramas.conditions){
                if(where_string.length > 0){
                    where_string += " and `" + p + "`"+ this.query_pramas.conditions[p].op + "\'" + this.query_pramas.conditions[p].value + "\'";
                } else {
                    where_string += " `" + p + "`"+ this.query_pramas.conditions[p].op + "\'" + this.query_pramas.conditions[p].value + "\'";
                }
            }
            sql += " where " + where_string;
        }
        if(this.query_pramas.order){
            var order_string=''
            for(var p in this.query_pramas.order){
                if(order_string.length > 0){
                    order_string += ",`" + p + "` "+ this.query_pramas.order[p];
                } else {
                    order_string += " `" + p + "` "+ this.query_pramas.order[p];
                }
            }

            sql += " order by" + order_string;
        }
        if(this.query_pramas.size){
            if(this.query_pramas.skip){
                sql += " limit "+ this.query_pramas.skip + "," + this.query_pramas.size;
            } else {
                sql += " limit "+ this.query_pramas.size;
            }
        }
        //console.log(sql);
        return sql;
    }

    *get_db(){
        var resource = yield Mysql.get_pool(this.config).require();
        if(resource.key == Mysql.get_pool(this.config).resource_gc){
            resource = yield Mysql.get_pool(this.config).require();
        }
        var db = resource.value;
        return db;
    }

    *run_sql(sql){
        var db = yield this.get_db();
        return new Promise(function(resolve, reject) {
            db.getConnection(function(err, connection) {
                connection.query(sql, function(err, rows) {
                    if(err){
                        reject(err); 
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            });
        }.bind(this));
    }

    *toArray(){
        var sql = this.build_select_sql();
        var rows = yield this.run_sql(sql);
        return rows;
        // return new Promise(function(resolve, reject) {      
        //     this.get_db().then(function(db) {
        //         db.connect();
        //         db.query(this.build_select_sql(), function(err, rows, fields) {
        //             if(err){
        //                 reject(err); 
        //             } else {
        //                 resolve(rows);
        //             }
        //             db.end();
        //         });
        //     }.bind(this)).catch(reject);
        // }.bind(this));
    }

    *insert(params) {
        return new Promise(function(resolve, reject) {      
            this.get_db().then(function(db) {
                var collection = db.collection(this.collection);
                collection.insertOne(params,function(err, result) {
                    if(err){
                        reject(err);
                    } else {
                        resolve(result.insertedId);
                    }
                    db.close();
                });
            }.bind(this)).catch(reject);
        }.bind(this));
    }

    *update(id,params) {
        return new Promise(function(resolve, reject) {      
            this.get_db().then(function(db) {
                var collection = db.collection(this.collection);
                collection.updateOne({'_id':ObjectID(id)},{$set:params},function(err, result) {
                    if(err){
                        reject(err);
                    } else {
                        resolve(result.modifiedCount);
                    }
                    db.close();
                });
            }.bind(this)).catch(reject);
        }.bind(this));
    }

    *delete(id) {
        return new Promise(function(resolve, reject) {      
            this.get_db().then(function(db) {
                var collection = db.collection(this.collection);
                collection.deleteOne({'_id':ObjectID(id)},function(err, result) {
                    if(err){
                        reject(err);
                    } else {
                        resolve(result.deletedCount);
                    }
                    db.close();
                });
            }.bind(this)).catch(reject);
        }.bind(this));
    }
}

module.exports = orm_mysql;