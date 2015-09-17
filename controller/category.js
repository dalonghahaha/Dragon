var model = require('../model/category');

module.exports = {
	index:function(){
		return new Promise( function (resolve, reject) {
			try{
				var category = new model();
				resolve(request.method);
			}
			catch(err){
				reject(err);
			}
		});
	}
}