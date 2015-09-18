function abstrct_controller() {

}

abstrct_controller.prototype.render = function(view,data){
	
	return 'abstrct_controller';
}

abstrct_controller.prototype.json = function(data){
	return {
		'code':200,
		'type':'application/json',
		'body':JSON.stringify(data)
	};
}


module.exports = abstrct_controller;