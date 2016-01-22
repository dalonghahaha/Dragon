"use strict";
var MysqlClient = require('mysql');
var Abstract = require('./abstract');
var Mysql = require('../db/mysql');
var logger = require('../tool/log');

class orm_mysql extends Abstract {

    constructor(table,config,primary){
        super();
        this.table = table;
        this.config = config;
        this.primary = primary ? primary : 'id';
    }

    init_pool(config){
        var conf_mysql= require(config['mysql_configuration']);
        var environment = config['environment'];
        var db_config = conf_mysql[environment];
        this.pool = MysqlClient.createPool(db_config);
    }

    build_select_sql(){
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
                var op = this.query_pramas.conditions[p].op ? this.query_pramas.conditions[p].op : "=";
                if(where_string.length > 0){
                    where_string += " and `" + p + "`"+ op + "\'" + this.query_pramas.conditions[p].value + "\'";
                } else {
                    where_string += " `" + p + "`"+ op + "\'" + this.query_pramas.conditions[p].value + "\'";
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

    build_insert_sql(params){
        var sql = 'insert into ' + this.table ;
        var fields = '';
        var values = '';
        for(var p in params){
            fields += fields.length > 0? ',`' + p +'`':'`' + p +'`';
            values += values.length > 0? ",\'" + params[p] + "\'":"\'" + params[p] + "\'";
        }
        var sql = sql + " (" + fields + ") values (" + values + ")";
        //console.log(sql);
        return sql;
    }

    build_update_sql(id,params){
        var sql = 'update ' + this.table + ' set ';
        for(var p in params){
            sql += '`' + p +'`=' + "\'" + params[p] + "\',";
        }
        var sql = sql.substring(0,sql.length - 1) + ' where ' + '`' + this.primary + '`=' + id;
        //console.log(sql);
        return sql;
    }

    build_delete_sql(id){
        var sql = 'delete from ' + this.table + ' where ' + '`' + this.primary + '`=' + id;
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
    }

    *insert(params) {
        var sql = this.build_insert_sql(params);
        var result = yield this.run_sql(sql);
        return result.insertId;
    }

    *update(id,params) {
        var sql = this.build_update_sql(id,params);
        var result = yield this.run_sql(sql);
        return result.changedRows >=0;
    }

    *delete(id) {
        var sql = this.build_delete_sql(id);
        var result = yield this.run_sql(sql);
        return result.affectedRows >=0;
    }
}

module.exports = orm_mysql;