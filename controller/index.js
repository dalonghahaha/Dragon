var util = require('util');
var abstrct_controller = require('../lib/abstrct_controller');
function controller(_request){
	this._request=_request;
}
util.inherits(controller, abstrct_controller);
controller.prototype.index=function(){
	console.log(this._request.action);
	return this.json({'name':'232'});
}
controller.prototype.index_test=function(){
	console.log(this._request.action);
	return this.json({'name':'232'});
}
module.exports = controller;