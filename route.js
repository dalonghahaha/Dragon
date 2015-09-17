module.exports = {
	dispatcher:function (request) {
		return new Promise( function (resolve, reject) {
			try{
				resolve(request.method);
			}
			catch(err){
				reject(err);
			}
		});
	}
}