"use strict";
var ObjectID = require('mongodb').ObjectID;
var Abstract = require('./abstract');
var Mongo = require('../db/mongodb');
var logger = require('../tool/log');

class orm_mongodb extends Abstract  {
    
    constructor(name,config){
        super();
        this.name = name;
        this.config = config;
        this.logger = new logger(config);
    }

    build_query(collection){
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
        return collection;
    }

    get_collection(){
        return new Promise(
            function(resolve, reject) {   
                Mongo.get_pool(this.config).require().then(function(resource){
                    var db = resource.value;
                    this.collection = db.collection(this.name);
                    resolve(this.collection);
                }.bind(this)).catch(reject);
            }.bind(this)
        );
    }

    toArray(){
        return new Promise(
            function(resolve, reject) {   
                this.get_collection().then(function(collection){
                    this.build_query(collection).toArray(function(err, result){
                        if(err){
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }.bind(this)).catch(reject);
            }.bind(this)
        );
    }

    insert(params){
        return new Promise(
            function(resolve, reject) {      
                this.get_collection().then(function(collection){
                    collection.insertOne(params,function(err, result){
                        if(err){
                            reject(err);
                        } else {
                            resolve(result.insertedId);
                        }
                    });
                }.bind(this)).catch(reject);
            }.bind(this)
        );
    }

    update(id,params){
        return new Promise(
            function(resolve, reject) {      
                this.get_collection().then(function(collection){
                    collection.updateOne({'_id':ObjectID(id)},{$set:params},function(err, result) {
                        if(err){
                            reject(err);
                        } else {
                            resolve(result.modifiedCount);
                        }
                    });
                }.bind(this)).catch(reject);
            }.bind(this)
        );
    }

    delete(id){
        return new Promise(
            function(resolve, reject) {      
                this.get_collection().then(function(collection){
                    collection.deleteOne({'_id':ObjectID(id)},function(err, result) {
                        if(err){
                            reject(err);
                        } else {
                            resolve(result.deletedCount);
                        }
                    });
                }.bind(this)).catch(reject);
            }.bind(this)
        );
    }
}

module.exports = orm_mongodb;