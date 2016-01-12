"use strict";
var MysqlClient = require('mysql');

class mysql  {
    constructor(table,config){
        this.table = table;
        this.config = config;
        this.query_pramas = {
            'conditions':{},
            'order':{}
        };
    }

    get_db(){
        return new Promise(function(resolve, reject) {
            try{
                var conf_mysql= require(this.config['mysql_configuration']);
                var environment = this.config['environment'];
                var db_config = conf_mysql[environment];
                var db = MysqlClient.createConnection(db_config);
                resolve(db);
            }
            catch(err){
                reject(err);
            }
        }.bind(this));
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
        console.log(sql);
        return sql;
    }

    query(fields) {
        this.query_pramas.fields = fields;
        return this;
    }

    filter(field,value,type){
        if(type){
            this.query_pramas.conditions[field] = {
                'op':type,
                'value':value
            }
        } else {
            this.query_pramas.conditions[field] = {
                'op':"=",
                'value':value
            }
        }
        return this;
    }

    limit(size,skip){
        this.query_pramas.size = size;
        if(skip != undefined){
            this.query_pramas.skip = skip;
        }
        return this;
    }

    sort(field,rule){
        this.query_pramas.order[field] = rule;
        return this;
    }

    toArray(){
        return new Promise(function(resolve, reject) {      
            this.get_db().then(function(db) {
                db.connect();
                db.query(this.build_select_sql(), function(err, rows, fields) {
                    if(err){
                        reject(err); 
                    } else {
                        resolve(rows);
                    }
                    db.end();
                });
            }.bind(this)).catch(reject);
        }.bind(this));
    }

    select(field) {
        return new Promise(function(resolve, reject) {      
            this.get_db().then(function(db) {
                db.connect();
                var sql = this.build_sql(field);
                db.query(sql, function(err, rows, fields) {
                    if(err){
                        reject(err); 
                    } else {
                        resolve(rows);
                    }
                    db.end();
                });
            }.bind(this)).catch(reject);
        }.bind(this));
    }

    insert(params) {
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

    update(id,params) {
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

    delete(id) {
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

module.exports = mysql;