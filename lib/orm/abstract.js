"use strict";

class orm_abstract {
  	constructor() {
    	this.query_pramas = {};
  	}

  	query(fields) {
        this.query_pramas.fields = fields.split(",");
        return this;
    }

    filter(field,value,type){
        if(!this.query_pramas.conditions){
            this.query_pramas.conditions = {};
        }
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
        if(!this.query_pramas.order){
            this.query_pramas.order = {};
        }
        this.query_pramas.order[field] = rule;
        return this;
    }
}

module.exports = orm_abstract;