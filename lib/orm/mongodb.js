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
        if(config.cached){
            this.cache = new cache(config.cache_type,config);
        }
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

    *get_collection(){
        var resource = yield Mongo.get_pool(this.config).require();
        if(resource.key == Mongo.get_pool(this.config).resource_gc){
            resource = yield Mongo.get_pool(this.config).require();
        }
        var db = resource.value;
        return db.collection(this.name);
    }

    *toArray(){
        var collection = yield this.get_collection();
        var result = yield this.build_query(collection).toArray();
        return result;
    }

    *insert(params){
        var collection = yield this.get_collection();
        var result = yield collection.insertOne(params);
        return result.insertedId;
    }

    *update(id,params){
        var collection = yield this.get_collection();
        var result = yield collection.updateOne({'_id':ObjectID(id)},{$set:params});
        return result.modifiedCount;
    }

    *delete(id){
        var collection = yield this.get_collection();
        var result = yield collection.deleteOne({'_id':ObjectID(id)});
        return result.deletedCount;
    }

}

module.exports = orm_mongodb;