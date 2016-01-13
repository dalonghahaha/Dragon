"use strict";

class orm_abstract {
  	constructor() {
    	this.query_pramas = {
            'conditions':{},
            'order':{}
        };
  	}

  	query(fields) {
        this.query_pramas.fields = fields.split(",");
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
}

module.exports = orm_abstract;