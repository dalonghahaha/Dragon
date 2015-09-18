"use strict";
var response = require('../lib/response');

class test extends response {

	constructor(_request) {
    	super(_request);
  	}

	index(){
		return this.json({'name':'232'});
	}
}

module.exports = test;