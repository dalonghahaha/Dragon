var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var logger = require('./logger');

function mongodb(collection,config){
	this.collection = collection;
	this.config = config;
    this.logger = new logger(config);
}

mongodb.prototype.get_connection = function(environment,conf_mongodb){
	var connection = "mongodb://";
    connection += conf_mongodb[environment]['user'];
    connection += ":" + conf_mongodb[environment]['password'];
    connection += "@" + conf_mongodb[environment]['host'];
    connection += ":" + conf_mongodb[environment]['port'];
    connection += "/" + conf_mongodb[environment]['database'];
    return connection;
}

mongodb.prototype.connection = function() {
    var conf_mongodb = require(this.config['mongodb_configuration']);
    var connection = this.get_connection(this.config['environment'],conf_mongodb);
    this.logger.debug('mongo_connection:' + connection);
    return connection;
}

mongodb.prototype.get_db = function(){
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

mongodb.prototype.find = function(search) {
    return new Promise(function(resolve, reject) {    	
        this.get_db().then(function(db) {
        	var collection = db.collection(this.collection);
       		collection.find(search).toArray(function(err, result) {
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

mongodb.prototype.insert = function(params) {
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

mongodb.prototype.update = function (id,params) {
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

mongodb.prototype.delete = function (id,params) {
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

mongodb.prototype.query = function (query_params) {
    // body...
}

module.exports = mongodb;