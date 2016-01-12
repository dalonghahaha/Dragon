"use strict";
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

class mongodb  {
    constructor(collection,config){
        this.collection = collection;
        this.config = config;
        this.query_pramas = {
            'conditions':{},
            'order':{}
        };
    }

    connection() {
        var conf_mongodb = require(this.config['mongodb_configuration']);
        var environment = this.config['environment'];
        var connection = "mongodb://";
        connection += conf_mongodb[environment]['user'];
        connection += ":" + conf_mongodb[environment]['password'];
        connection += "@" + conf_mongodb[environment]['host'];
        connection += ":" + conf_mongodb[environment]['port'];
        connection += "/" + conf_mongodb[environment]['database'];
        return connection;
    }

    get_db(){
        return new Promise(function(resolve, reject) {
            MongoClient.connect(this.connection(), function(err, db) {
                if(err){
                    reject(err);
                } else {
                    resolve(db);
                }
            });
        }.bind(this));
    }

    query(fields) {
        this.query_pramas.fields = fields.split(",");
        return this;
    }

    filter(field,value,type){
        if(type){

        } else {
            this.query_pramas.conditions[field] = value
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
                var collection = db.collection(this.collection);
                if(this.query_pramas.fields){
                    var condition = {};
                    this.query_pramas.fields.forEach(function(name){
                        condition[name]=1;
                    });
                    collection = collection.find(this.query_pramas.conditions,condition);
                } else {
                    collection = collection.find(this.query_pramas.conditions);
                }
                if(this.query_pramas.size){
                    collection = collection.limit(this.query_pramas.size);
                }
                if(this.query_pramas.skip){
                    collection = collection.skip(this.query_pramas.skip);
                }
                if(this.query_pramas.order){
                    collection = collection.sort(this.query_pramas.order);
                }
                collection.toArray(function(err, result) {
                    if(err){
                        reject(err);
                    } else {
                        resolve(result);
                    }
                    db.close();
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

module.exports = mongodb;